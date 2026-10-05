import { createRouter, createWebHistory } from 'vue-router';
import DashboardView from '../views/DashboardView.vue';
import MasterView from '../views/MasterView.vue';
import DryDockListView from '../views/DryDockListView.vue';
import DryDockLayoutView from '../views/DryDockLayoutView.vue';
import DryDockGeneralView from '../views/DryDockGeneralView.vue';
import TasksView from '../views/TasksView.vue';
import SourcingView from '../views/SourcingView.vue';
import ExecutionView from '../views/ExecutionView.vue';
import ReportingView from '../views/ReportingView.vue';
import CostsView from '../views/CostsView.vue';
import PurchaseOrdersView from '../views/PurchaseOrdersView.vue';

export default createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/dashboard' },
    { path: '/dashboard', component: DashboardView },
    { path: '/spec-groups', component: MasterView, props: { page: 'specGroups' } },
    { path: '/work-order-masters', component: MasterView, props: { page: 'workOrderMasters' } },
    { path: '/checklists', component: MasterView, props: { page: 'checklists' } },
    { path: '/vessels', component: MasterView, props: { page: 'vessels' } },
    { path: '/shipyards', component: MasterView, props: { page: 'shipyards' } },
    { path: '/dry-docks', component: DryDockListView },
    {
      path: '/dry-docks/:id',
      component: DryDockLayoutView,
      props: true,
      children: [
        { path: '', name: 'dry-dock-general', component: DryDockGeneralView },
        { path: 'tasks', name: 'dry-dock-tasks', component: TasksView },
        { path: 'sourcing', name: 'dry-dock-sourcing', component: SourcingView },
        { path: 'execution', name: 'dry-dock-execution', component: ExecutionView },
        { path: 'reporting', name: 'dry-dock-reporting', component: ReportingView },
        { path: 'costs', name: 'dry-dock-costs', component: CostsView },
        { path: 'purchase-orders', name: 'dry-dock-purchase-orders', component: PurchaseOrdersView },
      ],
    },
  ],
});
