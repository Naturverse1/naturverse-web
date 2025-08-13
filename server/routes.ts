import { createServer, type Server } from 'http';

import type { Express } from 'express';

import { ObjectStorageService, ObjectNotFoundError } from './objectStorage';
import { storage } from './storage';

export async function registerRoutes(app: Express): Promise<Server> {
  // Object storage routes for avatar uploads

  // Endpoint to get upload URL for avatar
  app.post('/api/objects/upload', async (req, res) => {
    const objectStorageService = new ObjectStorageService();
    try {
      const uploadURL = await objectStorageService.getObjectEntityUploadURL();
      res.json({ uploadURL });
    } catch (error) {
      console.error('Error getting upload URL:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Endpoint to serve uploaded objects (avatars)
  app.get('/objects/:objectPath(*)', async (req, res) => {
    const objectStorageService = new ObjectStorageService();
    try {
      const objectFile = await objectStorageService.getObjectEntityFile(req.path);
      objectStorageService.downloadObject(objectFile, res);
    } catch (error) {
      console.error('Error accessing object:', error);
      if (error instanceof ObjectNotFoundError) {
        return res.sendStatus(404);
      }
      return res.sendStatus(500);
    }
  });

  // Endpoint to update avatar URL after upload
  app.put('/api/avatar', async (req, res) => {
    if (!req.body.avatarURL) {
      return res.status(400).json({ error: 'avatarURL is required' });
    }

    try {
      const objectStorageService = new ObjectStorageService();
      const objectPath = objectStorageService.normalizeObjectEntityPath(req.body.avatarURL);

      res.status(200).json({
        objectPath: objectPath,
      });
    } catch (error) {
      console.error('Error setting avatar:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
