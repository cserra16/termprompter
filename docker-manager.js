/**
 * Docker Manager for TermPrompter
 * Manages Docker containers for demo environments
 */

const Docker = require('dockerode');
const path = require('path');

class DockerManager {
    constructor() {
        this.docker = new Docker();
        this.activeContainer = null;
        this.containerConfig = null;
        this.execProcess = null;
        this.isDockerAvailable = false;
        this.basePath = null; // Base path for resolving volume paths
    }

    /**
     * Check if Docker is available and running
     * @returns {Promise<boolean>}
     */
    async checkDockerAvailable() {
        try {
            await this.docker.ping();
            this.isDockerAvailable = true;
            return true;
        } catch (error) {
            console.error('[DockerManager] Docker not available:', error.message);
            this.isDockerAvailable = false;
            return false;
        }
    }

    /**
     * Pull an image if it doesn't exist locally
     * @param {string} imageName - The Docker image name
     * @param {function} onProgress - Progress callback
     * @returns {Promise<void>}
     */
    async pullImageIfNeeded(imageName, onProgress = null) {
        try {
            // Check if image exists locally
            const images = await this.docker.listImages({
                filters: { reference: [imageName] }
            });

            if (images.length > 0) {
                console.log(`[DockerManager] Image ${imageName} already exists locally`);
                return;
            }

            console.log(`[DockerManager] Pulling image ${imageName}...`);

            return new Promise((resolve, reject) => {
                this.docker.pull(imageName, (err, stream) => {
                    if (err) {
                        reject(err);
                        return;
                    }

                    this.docker.modem.followProgress(stream, (err, output) => {
                        if (err) {
                            reject(err);
                        } else {
                            console.log(`[DockerManager] Image ${imageName} pulled successfully`);
                            resolve();
                        }
                    }, (event) => {
                        if (onProgress) {
                            onProgress(event);
                        }
                    });
                });
            });
        } catch (error) {
            throw new Error(`Failed to pull image ${imageName}: ${error.message}`);
        }
    }

    /**
     * Create and start a container from the demo configuration
     * @param {object} config - Docker configuration from the demo frontmatter
     * @param {string} basePath - Base path for resolving relative volume paths
     * @param {function} onProgress - Progress callback for image pull
     * @returns {Promise<object>} - Container info
     */
    async startContainer(config, basePath, onProgress = null) {
        if (!this.isDockerAvailable) {
            const available = await this.checkDockerAvailable();
            if (!available) {
                throw new Error('Docker is not available. Please ensure Docker is installed and running.');
            }
        }

        this.basePath = basePath;
        this.containerConfig = config;

        // Pull the image if needed
        await this.pullImageIfNeeded(config.image, onProgress);

        // Check if a container with this name already exists
        const containerName = config.name || `termprompter-${Date.now()}`;

        try {
            const existingContainer = this.docker.getContainer(containerName);
            const info = await existingContainer.inspect();

            // If container exists, check if it's running
            if (info.State.Running) {
                console.log(`[DockerManager] Container ${containerName} already running, reusing it`);
                this.activeContainer = existingContainer;
                return { containerId: info.Id, name: containerName, reused: true };
            } else {
                // Remove the stopped container
                console.log(`[DockerManager] Removing stopped container ${containerName}`);
                await existingContainer.remove();
            }
        } catch (error) {
            // Container doesn't exist, continue to create it
        }

        // Prepare container configuration
        const createOptions = {
            Image: config.image,
            name: containerName,
            Tty: true,
            OpenStdin: true,
            StdinOnce: false,
            AttachStdin: true,
            AttachStdout: true,
            AttachStderr: true,
            Cmd: config.cmd || ['/bin/bash'],
            WorkingDir: config.workdir || '/root',
            Env: this.parseEnvironment(config.env),
            HostConfig: {
                Binds: this.parseVolumes(config.volumes),
                PortBindings: this.parsePortBindings(config.ports),
                AutoRemove: config.autoRemove !== false // Auto-remove by default
            }
        };

        // Create the container
        console.log(`[DockerManager] Creating container ${containerName} from image ${config.image}`);
        this.activeContainer = await this.docker.createContainer(createOptions);

        // Start the container
        await this.activeContainer.start();
        console.log(`[DockerManager] Container ${containerName} started`);

        const containerInfo = await this.activeContainer.inspect();
        return {
            containerId: containerInfo.Id,
            name: containerName,
            reused: false
        };
    }

    /**
     * Create an exec instance for the container and return a stream
     * @param {number} cols - Terminal columns
     * @param {number} rows - Terminal rows
     * @returns {Promise<object>} - Exec stream and info
     */
    async createExecStream(cols = 80, rows = 24) {
        if (!this.activeContainer) {
            throw new Error('No active container');
        }

        const exec = await this.activeContainer.exec({
            AttachStdin: true,
            AttachStdout: true,
            AttachStderr: true,
            Tty: true,
            Cmd: this.containerConfig?.shell || ['/bin/bash'],
            Env: this.parseEnvironment(this.containerConfig?.env)
        });

        const stream = await exec.start({
            hijack: true,
            stdin: true,
            Tty: true
        });

        this.execProcess = { exec, stream };

        // Resize to initial dimensions
        try {
            await exec.resize({ h: rows, w: cols });
        } catch (error) {
            console.warn('[DockerManager] Could not resize exec:', error.message);
        }

        return { exec, stream };
    }

    /**
     * Write data to the container's stdin
     * @param {string|Buffer} data - Data to write
     */
    write(data) {
        if (this.execProcess && this.execProcess.stream) {
            this.execProcess.stream.write(data);
        }
    }

    /**
     * Resize the container's terminal
     * @param {number} cols - Terminal columns
     * @param {number} rows - Terminal rows
     */
    async resize(cols, rows) {
        if (this.execProcess && this.execProcess.exec) {
            try {
                await this.execProcess.exec.resize({ h: rows, w: cols });
            } catch (error) {
                console.warn('[DockerManager] Could not resize exec:', error.message);
            }
        }
    }

    /**
     * Stop and remove the active container
     * @returns {Promise<void>}
     */
    async stopContainer() {
        if (!this.activeContainer) {
            return;
        }

        const containerName = this.containerConfig?.name || 'unknown';

        try {
            // Close the exec stream first
            if (this.execProcess && this.execProcess.stream) {
                this.execProcess.stream.end();
                this.execProcess = null;
            }

            // Check if container is running
            const info = await this.activeContainer.inspect();

            if (info.State.Running) {
                console.log(`[DockerManager] Stopping container ${containerName}`);
                await this.activeContainer.stop({ t: 5 }); // 5 second timeout
            }

            // Remove the container if not auto-removed
            if (this.containerConfig?.autoRemove === false) {
                console.log(`[DockerManager] Removing container ${containerName}`);
                await this.activeContainer.remove();
            }

        } catch (error) {
            // Container might already be stopped or removed
            console.warn(`[DockerManager] Error stopping container: ${error.message}`);
        }

        this.activeContainer = null;
        this.containerConfig = null;
        console.log(`[DockerManager] Container ${containerName} cleaned up`);
    }

    /**
     * Get the status of the active container
     * @returns {Promise<object|null>}
     */
    async getContainerStatus() {
        if (!this.activeContainer) {
            return null;
        }

        try {
            const info = await this.activeContainer.inspect();
            return {
                id: info.Id,
                name: info.Name,
                state: info.State.Status,
                running: info.State.Running,
                image: info.Config.Image
            };
        } catch (error) {
            return null;
        }
    }

    /**
     * Check if there is an active Docker session
     * @returns {boolean}
     */
    hasActiveSession() {
        return this.activeContainer !== null;
    }

    /**
     * Parse volume bindings from config
     * @param {Array<string>} volumes - Volume configurations
     * @returns {Array<string>}
     */
    parseVolumes(volumes) {
        if (!volumes || !Array.isArray(volumes)) {
            return [];
        }

        return volumes.map(vol => {
            // Parse volume format: host:container or host:container:mode
            const parts = vol.split(':');
            if (parts.length >= 2) {
                let hostPath = parts[0];
                const containerPath = parts[1];
                const mode = parts[2] || 'rw';

                // Resolve relative paths
                if (hostPath.startsWith('./') || hostPath.startsWith('../') || !path.isAbsolute(hostPath)) {
                    if (this.basePath) {
                        hostPath = path.resolve(this.basePath, hostPath);
                    }
                }

                return `${hostPath}:${containerPath}:${mode}`;
            }
            return vol;
        });
    }

    /**
     * Parse port bindings from config
     * @param {Array<string>} ports - Port configurations
     * @returns {object}
     */
    parsePortBindings(ports) {
        if (!ports || !Array.isArray(ports)) {
            return {};
        }

        const bindings = {};

        ports.forEach(port => {
            // Parse port format: hostPort:containerPort or just containerPort
            const portStr = port.toString().replace(/"/g, '');
            const parts = portStr.split(':');

            let hostPort, containerPort;
            if (parts.length === 2) {
                hostPort = parts[0];
                containerPort = parts[1];
            } else {
                hostPort = containerPort = parts[0];
            }

            // Ensure port has protocol
            const containerPortKey = containerPort.includes('/')
                ? containerPort
                : `${containerPort}/tcp`;

            bindings[containerPortKey] = [{ HostPort: hostPort }];
        });

        return bindings;
    }

    /**
     * Parse environment variables from config
     * @param {object|Array} env - Environment configuration
     * @returns {Array<string>}
     */
    parseEnvironment(env) {
        if (!env) {
            return [];
        }

        if (Array.isArray(env)) {
            return env;
        }

        // Convert object to array of KEY=value strings
        return Object.entries(env).map(([key, value]) => `${key}=${value}`);
    }
}

module.exports = DockerManager;
