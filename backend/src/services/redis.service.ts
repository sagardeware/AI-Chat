import { createClient, RedisClientType } from 'redis';

class RedisService {
    private client: RedisClientType | null = null;
    private isEnabled: boolean = false;
    private isConnected: boolean = false;
    private initialized: boolean = false;

    constructor() {
        // Don't initialize in constructor - wait for explicit init() call
    }

    /**
     * Initialize Redis connection (call this after dotenv.config())
     */
    async init() {
        if (this.initialized) {
            return; // Already initialized
        }

        this.initialized = true;

        // Debug logging
        console.log('🔍 Redis Config Debug:');
        console.log('  REDIS_ENABLED:', process.env.REDIS_ENABLED);
        console.log('  REDIS_URL:', process.env.REDIS_URL ? '✅ Set' : '❌ Not set');

        this.isEnabled = process.env.REDIS_ENABLED === 'true';

        if (this.isEnabled) {
            await this.initializeClient();
        } else {
            console.log('📦 Redis is disabled. Running without cache.');
        }
    }

    private async initializeClient() {
        try {
            const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

            this.client = createClient({
                url: redisUrl,
                socket: {
                    reconnectStrategy: (retries) => {
                        if (retries > 10) {
                            console.error('❌ Redis: Max reconnection attempts reached');
                            return new Error('Max reconnection attempts reached');
                        }
                        return Math.min(retries * 100, 3000);
                    }
                }
            });

            this.client.on('error', (err) => {
                console.error('❌ Redis Client Error:', err);
                this.isConnected = false;
            });

            this.client.on('connect', () => {
                console.log('🔴 Redis: Connecting...');
            });

            this.client.on('ready', () => {
                console.log('✅ Redis: Connected and ready');
                this.isConnected = true;
            });

            this.client.on('reconnecting', () => {
                console.log('🔄 Redis: Reconnecting...');
            });

            await this.client.connect();
        } catch (error) {
            console.error('❌ Redis initialization failed:', error);
            this.client = null;
            this.isConnected = false;
        }
    }

    /**
     * Get value from Redis cache
     */
    async get(key: string): Promise<string | null> {
        if (!this.isEnabled || !this.client || !this.isConnected) {
            return null;
        }

        try {
            return await this.client.get(key);
        } catch (error) {
            console.error(`❌ Redis GET error for key ${key}:`, error);
            return null;
        }
    }

    /**
     * Set value in Redis cache with optional TTL
     */
    async set(key: string, value: string, ttlSeconds?: number): Promise<boolean> {
        if (!this.isEnabled || !this.client || !this.isConnected) {
            return false;
        }

        try {
            if (ttlSeconds) {
                await this.client.setEx(key, ttlSeconds, value);
            } else {
                await this.client.set(key, value);
            }
            return true;
        } catch (error) {
            console.error(`❌ Redis SET error for key ${key}:`, error);
            return false;
        }
    }

    /**
     * Delete key from Redis cache
     */
    async del(key: string): Promise<boolean> {
        if (!this.isEnabled || !this.client || !this.isConnected) {
            return false;
        }

        try {
            await this.client.del(key);
            return true;
        } catch (error) {
            console.error(`❌ Redis DEL error for key ${key}:`, error);
            return false;
        }
    }

    /**
     * Increment value in Redis (for rate limiting)
     */
    async incr(key: string): Promise<number | null> {
        if (!this.isEnabled || !this.client || !this.isConnected) {
            return null;
        }

        try {
            return await this.client.incr(key);
        } catch (error) {
            console.error(`❌ Redis INCR error for key ${key}:`, error);
            return null;
        }
    }

    /**
     * Set expiry on a key
     */
    async expire(key: string, seconds: number): Promise<boolean> {
        if (!this.isEnabled || !this.client || !this.isConnected) {
            return false;
        }

        try {
            await this.client.expire(key, seconds);
            return true;
        } catch (error) {
            console.error(`❌ Redis EXPIRE error for key ${key}:`, error);
            return false;
        }
    }

    /**
     * Check if Redis is available
     */
    isAvailable(): boolean {
        return this.isEnabled && this.isConnected && this.client !== null;
    }

    /**
     * Gracefully disconnect from Redis
     */
    async disconnect(): Promise<void> {
        if (this.client && this.isConnected) {
            try {
                await this.client.quit();
                console.log('🔴 Redis: Disconnected');
            } catch (error) {
                console.error('❌ Redis disconnect error:', error);
            }
        }
    }
}

// Export singleton instance
export const redisService = new RedisService();
