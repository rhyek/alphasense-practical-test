import { Express } from 'express';
import { ReflectiveInjector } from 'injection-js';
import { SessionService } from '../application/session.service';

export function registerHttpEndpoints(
  injector: ReflectiveInjector,
  app: Express
) {
  const sessionService: SessionService = injector.get(SessionService);

  app.post('/sign-in', (req, res) => {
    sessionService.signIn(req.body.username);
    res.end();
  });
  app.post('/sign-out', (req, res) => {
    sessionService.signOut(req.body.username);
    res.end();
  });
}
