import Vue from 'vue';
import Router from 'vue-router';

import Hello from '@/components/Hello';
import Dynamic from '@/routes/Dynamic';
import Nested from '@/routes/Nested';
import ComponentA from '@/routes/Nested/routes/ComponentA';
import ComponentB from '@/routes/Nested/routes/ComponentB';
import NotFound from '@/routes/NotFound';
import Protected from '@/routes/Protected';
import Dashboard from '@/routes/Protected/routes/Dashboard';
import Login from '@/routes/Protected/routes/Login';

import auth from '@/utils/auth';

Vue.use(Router);

function requireAuth(to, from, next) {
  if (!auth.loggedIn()) {
    next({
      path: '/protected/login',
      query: { redirect: to.fullPath },
    });
  } else {
    next();
  }
}

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Hello',
      component: Hello,
    },
    {
      path: '/dynamic/:id',
      name: 'Dynamic',
      component: Dynamic,
    },
    {
      path: '/nested',
      component: Nested,
      children: [
        {
          path: 'componentA',
          component: ComponentA,
        },
        {
          path: 'componentB',
          component: ComponentB,
        },
      ],
    },
    {
      path: '/not-found',
      name: 'NotFound',
      component: NotFound,
    },
    {
      path: '/protected',
      component: Protected,
      children: [
        {
          path: 'dashboard',
          component: Dashboard,
          beforeEnter: requireAuth,
        },
        {
          path: 'login',
          component: Login,
        },
        {
          path: 'logout',
          beforeEnter(to, from, next) {
            auth.logout();
            next('/protected');
          },
        },
      ],
    },
    {
      path: '*',
      redirect: '/not-found',
    },
  ],
});
