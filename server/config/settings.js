module.exports = {
    cache: {
        dev: {
            hostname: '127.0.0.1',
            port: 6379
        }
    },
    ldap: {
        server: {
            url: 'ldap://127.0.0.1:389',
            searchBase: 'ou=Users,dc=openstack,dc=org',
            searchFilter: '(uid={{username}})',
        }
    },
    port: {
        dev: 8080
    },
    version : 'v1'
};