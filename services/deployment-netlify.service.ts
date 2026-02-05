import crypto from 'crypto';

interface NetlifySite {
  id: string;
  name: string;
  default_domain: string;
  ssl_url?: string;
  url?: string;
}

interface NetlifyDeploy {
  id: string;
  site_id: string;
  state: string;
  required: string[];
  deploy_ssl_url?: string;
  deploy_url?: string;
  ssl_url?: string;
  url?: string;
}

class NetlifyDeploymentService {
  private readonly apiToken: string;
  private readonly siteId?: string;
  private readonly baseUrl = 'https://api.netlify.com/api/v1';

  constructor() {
    this.apiToken = process.env.NETLIFY_TOKEN || '';
    this.siteId = process.env.NETLIFY_SITE_ID;
  }

  async deploySite(
    siteId: string,
    files: Map<string, string>
  ): Promise<{ url: string }> {
    if (!this.apiToken) {
      throw new Error('NETLIFY_TOKEN not configured');
    }

    // Generate a unique site name using timestamp and random suffix
    const timestamp = Date.now().toString(36);
    const randomSuffix = crypto.randomBytes(3).toString('hex');
    const siteName = `site-${siteId.substring(0, 8)}-${timestamp}-${randomSuffix}`;
    const netlifySite = await this.getOrCreateSite(siteName);

    const fileEntries = this.buildFileEntries(files);
    const deploy = await this.createDeploy(netlifySite.id, fileEntries.digests);

    if (deploy.required?.length) {
      await this.uploadRequiredFiles(deploy.id, deploy.required, fileEntries);
    }

    const finalDeploy = await this.waitForDeploy(deploy.id);
    const url =
      finalDeploy.ssl_url ||
      finalDeploy.deploy_ssl_url ||
      finalDeploy.url ||
      `https://${netlifySite.default_domain}`;

    return { url };
  }

  private async getOrCreateSite(siteName: string): Promise<NetlifySite> {
    if (this.siteId) {
      const response = await fetch(`${this.baseUrl}/sites/${this.siteId}`, {
        headers: { Authorization: `Bearer ${this.apiToken}` },
      });

      if (!response.ok) {
        const body = await response.text();
        throw new Error(`Failed to load Netlify site: ${body}`);
      }

      return response.json() as Promise<NetlifySite>;
    }

    const listResponse = await fetch(`${this.baseUrl}/sites?filter=all`, {
      headers: { Authorization: `Bearer ${this.apiToken}` },
    });

    if (listResponse.ok) {
      const sites = (await listResponse.json()) as NetlifySite[];
      const existing = sites.find((site) => site.name === siteName);
      if (existing) return existing;
    }

    const createResponse = await fetch(`${this.baseUrl}/sites`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.apiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: siteName }),
    });

    if (!createResponse.ok) {
      const body = await createResponse.text();
      throw new Error(`Failed to create Netlify site: ${body}`);
    }

    return createResponse.json() as Promise<NetlifySite>;
  }

  private buildFileEntries(files: Map<string, string>): {
    digests: Record<string, string>;
    hashToPath: Map<string, string>;
    pathToContent: Map<string, Buffer>;
  } {
    const digests: Record<string, string> = {};
    const hashToPath = new Map<string, string>();
    const pathToContent = new Map<string, Buffer>();

    for (const [filename, content] of files.entries()) {
      const normalizedPath = filename.startsWith('/') ? filename : `/${filename}`;
      const buffer = Buffer.from(content, 'utf-8');
      const hash = crypto.createHash('sha1').update(buffer).digest('hex');
      digests[normalizedPath] = hash;
      hashToPath.set(hash, normalizedPath);
      pathToContent.set(normalizedPath, buffer);
    }

    return { digests, hashToPath, pathToContent };
  }

  private async createDeploy(siteId: string, files: Record<string, string>): Promise<NetlifyDeploy> {
    const response = await fetch(`${this.baseUrl}/sites/${siteId}/deploys`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.apiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ files }),
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Failed to create Netlify deploy: ${body}`);
    }

    return response.json() as Promise<NetlifyDeploy>;
  }

  private async uploadRequiredFiles(
    deployId: string,
    requiredHashes: string[],
    entries: {
      hashToPath: Map<string, string>;
      pathToContent: Map<string, Buffer>;
    }
  ): Promise<void> {
    for (const hash of requiredHashes) {
      const filePath = entries.hashToPath.get(hash);
      if (!filePath) continue;

      const content = entries.pathToContent.get(filePath);
      if (!content) continue;

      // Convert Buffer to string for fetch body compatibility
      const bodyContent = content.toString('utf-8');

      const uploadResponse = await fetch(
        `${this.baseUrl}/deploys/${deployId}/files${filePath}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${this.apiToken}`,
            'Content-Type': 'application/octet-stream',
          },
          body: bodyContent,
        }
      );

      if (!uploadResponse.ok) {
        const body = await uploadResponse.text();
        throw new Error(`Failed to upload ${filePath}: ${body}`);
      }
    }
  }

  private async waitForDeploy(deployId: string, maxWaitMs = 60000): Promise<NetlifyDeploy> {
    const startTime = Date.now();
    const pollInterval = 2000;

    while (Date.now() - startTime < maxWaitMs) {
      const response = await fetch(`${this.baseUrl}/deploys/${deployId}`, {
        headers: { Authorization: `Bearer ${this.apiToken}` },
      });

      if (!response.ok) {
        const body = await response.text();
        throw new Error(`Failed to get deploy status: ${body}`);
      }

      const deploy = (await response.json()) as NetlifyDeploy;
      if (deploy.state === 'ready') return deploy;
      if (deploy.state === 'error') throw new Error('Netlify deploy failed');

      await new Promise((resolve) => setTimeout(resolve, pollInterval));
    }

    throw new Error('Netlify deploy timed out');
  }
}

export const netlifyDeploymentService = new NetlifyDeploymentService();