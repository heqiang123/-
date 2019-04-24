import Vue from 'vue'
import VueRouter from 'vue-router'


Vue.use(VueRouter);
const router = new VueRouter({
    routes: [
        {
            path: '/',
            redirect: '/index'
        },
        {
            path: '/login',
            component: resolve => require(['@/page/login/login.vue'], resolve),
            meta: {
                title: '登陆'
            }
        },
        {
            path: '/404',
            component: resolve => require(['../components/common/404.vue'], resolve)
        },
        {
            path: '/403',
            component: resolve => require(['../components/common/403.vue'], resolve)
        },
        // 使用动态路由请注释掉下面对象
        // {
        //   path: '/',
        //     component: resolve => require(['@/components/Common/Home.vue'], resolve),
        //     meta: { title: '自述文件' },
        //     children: [
        //       {
        //         name: 'index',
        //         path: '/index',
        //         component: resolve => require.ensure([], () => resolve(require('@/page/index/index.vue')), 'index'),
        //         meta: {
        //           title: '系统日志'
        //         }
        //       },
        //       {
        //         name: 'messageboard',
        //         path: '/messageboard',
        //         component: resolve => require.ensure([], () => resolve(require('@/page/tablepage/messageboard.vue')), 'messageboard'),
        //         meta: {
        //           title: '系统首页'
        //         }
        //       },
        //       {
        //         name: 'searchinput',
        //         path: '/searchinput',
        //         component: resolve => require.ensure([], () => resolve(require('@/page/searchinput/searchinput.vue')), 'searchinput'),
        //         meta: {
        //           title: '查询输入页'
        //         }
        //       },
        //       {
        //         name: 'tabpage',
        //         path: '/tabpage',
        //         component: resolve => require.ensure([], () => resolve(require('@/page/tabpage/tabpage.vue')), 'tabpage'),
        //         meta: {
        //           title: '标签选项卡'
        //         }
        //       },
        //       {
        //         name: 'tablepage',
        //         path: '/tablepage',
        //         component: resolve => require.ensure([], () => resolve(require('@/page/tablepage/tablepage.vue')), 'tablepage'),
        //         meta: {
        //           title: '综合表格页'
        //         }
        //       }
        //       ,
        //       {
        //         name: 'formpage',
        //         path: '/formpage',
        //         component: resolve => require.ensure([], () => resolve(require('@/page/formpage/formpage.vue')), 'formpage'),
        //         meta: {
        //           title: '表单页'
        //         }
        //       }
        //       ,
        //       {
        //         name: 'treepage',
        //         path: '/treepage',
        //         component: resolve => require.ensure([], () => resolve(require('@/page/treepage/treepage.vue')), 'treepage'),
        //         meta: {
        //           title: '树组件页'
        //         }
        //       },
        //       {
        //         name: 'OrganizationTree',
        //         path: '/organizationTree',
        //         component: resolve => require.ensure([], () => resolve(require('@/page/admin/OrganizationTree.vue')), 'OrganizationTree'),
        //         meta: { title: '机构管理' }
        //       },
        //       {
        //         name: 'SysUser',
        //         path: '/sysUser',
        //         component: resolve => require.ensure([], () => resolve(require('@/page/admin/SysUser.vue')), 'SysUser'),
        //         meta: { title: '用户管理' }
        //       },
        //       {
        //         name: 'SysAcl',
        //         path: '/sysAcl',
        //         component: resolve => require.ensure([], () => resolve(require('@/page/admin/SysAcl.vue')), 'SysAcl'),
        //         meta: { title: '角色资源管理' }
        //       },
        //       {
        //         name: 'SysMenu',
        //         path: '/sysMenu',
        //         component: resolve => require.ensure([], () => resolve(require('@/page/admin/SysMenu.vue')), 'SysMenu'),
        //         meta: { title: '菜单管理' }
        //       },
        //       {
        //         name: 'SysResource',
        //         path: '/sysResource',
        //         component: resolve => require.ensure([], () => resolve(require('@/page/admin/SysResource.vue')), 'SysResource'),
        //         meta: { title: '资源管理' }
        //       },
        //       {
        //         name: 'SysRole',
        //         path: '/sysRole',
        //         component: resolve => require.ensure([], () => resolve(require('@/page/admin/SysRole.vue')), 'SysRole'),
        //         meta: { title: '角色管理' }
        //       },
        //       {
        //         name: 'sysRoleMap',
        //         path: '/sysRoleMap',
        //         component: resolve => require.ensure([], () => resolve(require('@/page/admin/SysRoleMap.vue')), 'sysRoleMap'),
        //         meta: { title: '角色权限管理' }
        //       },
        //       {
        //         name: 'msg',
        //         path: '/msg',
        //         component: resolve => require.ensure([], () => resolve(require('@/page/message/msg.vue')), 'msg'),
        //         meta: { title: '建议留言' }
        //       },
        //       {
        //         name: 'messageboard',
        //         path: '/messageboard',
        //         component: resolve => require.ensure([], () => resolve(require('@/page/tablepage/messageboard.vue')), 'messageboard'),
        //         meta: {
        //           title: '综合表格页'
        //         }
        //       },
        //       {
        //         name:'detail',
        //         path: '/detail',
        //         component: resolve => require.ensure([], () => resolve(require('@/page/tablepage/detail.vue')), 'detail'),
        //         meta:{title:'详情页'}
        //       }, 
        //       {
        //         name:'ckeditor',
        //         path: '/ckeditor',
        //         component: resolve => require.ensure([], () => resolve(require('@/page/ckeditor/index.vue')), 'ckeditor'),
        //         meta:{title:'文本编辑器'}
        //       }
        //     ]
        // },
        {
            path: '*',
            redirect: '/404'
        }
    ],
    mode: 'history'
});

//全局路由守卫
router.beforeEach((to, from, next) => {
    //debugger
    console.log('跳转到:', to);
    if (to.path == '/tree') {
        next();
    } else {
        var token = sessionStorage.getItem('token');
        //如果没登录,都导向登录页
        if (!token) {
            if (to.path !== '/login') {
                next({path: '/login'})
            } else {
                next();
            }
        } else {
            next();
        }
    }

})

export default router
