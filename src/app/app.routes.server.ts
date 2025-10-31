import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'admin/dashboard/:reference',
    renderMode: RenderMode.Client  // Rendu côté client pour les routes avec paramètres
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender  // Prerender pour les autres routes statiques
  }
];
