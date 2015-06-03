/**
 * Created by danielalorenzo on 21/5/15.
 */
angular.module('BEEFound.services.Users', [])
    .service('userService', function(){

        var rolList = [
            {
                id: 1,
                name: "Desarrollador"
            },
            {
                id: 2,
                name: "Jefe de Proyecto"
            },
            {
                id: 3,
                name: "Jefe de Equipo"
            }
        ];

        var proyectList = [
            {
                id: 1,
                name: 'Territorios Solidarios',
                lenguaje: 'php',
                info: ''
            },
            {
                id: 2,
                name: 'Thats English',
                lenguaje: 'php',
                info: 'Framework de symfony2'
            },
            {
                id: 3,
                name: 'CAE',
                lenguaje: 'php',
                info: 'Wordpress'
            }
        ];

        var userList = [
            {
                id: 1,
                user: {
                    name: 'Nany',
                    surname: 'Lorenzo'
                },
                sexo: 'Mujer',
                rol: rolList[0],
                telefono: '678912345',
                email: 'daniela.lorenzo@beeva.com',
                proyects: [
                    {
                        name: proyectList[2],
                        year: "2015",
                        rol: rolList[0]
                    },
                    {
                        name: proyectList[1],
                        year: "2013",
                        rol: rolList[0]
                    },
                    {
                        name: proyectList[0],
                        year: "2012",
                        rol: rolList[0]
                    }

                ],
                url: 'www.beeva.com'
            },
            {
                id: 2,
                user: {
                    name: 'Javier',
                    surname: 'de Andres'
                },
                sexo: 'Hombre',
                rol: rolList[1],
                telefono: '678912345',
                email: 'javier.deandres@beeva.com',
                proyects: [
                    {
                        name: proyectList[2],
                        year: "2015",
                        rol: rolList[1]
                    },
                    {
                        name: proyectList[1],
                        year: "2013",
                        rol: rolList[1]
                    }
                ],
                url: 'www.beeva.com'
            },
            {
                id: 3,
                user: {
                    name: 'Victor',
                    surname: 'Martin'
                },
                sexo: 'Hombre',
                rol: rolList[0],
                telefono: '678912345',
                email: 'victor.martin@beeva.com',
                proyects: [
                    {
                        name: proyectList[2],
                        year: "2015",
                        rol: rolList[1]
                    },
                    {
                        name: proyectList[1],
                        year: "2014",
                        rol: rolList[0]
                    }
                ],
                url: 'www.beeva.com'
            }
        ];

        /* Returns user list */
        this.getUsers = function() {
            return userList;
        };

        /* Returns a user by its id */
        this.getUser = function(id) {
            for (i in userList){
                if (userList[i].id == id){
                    return userList[i];
                }
            }
        }

        /* Returns proyect list */
        this.getProyects = function() {
            return proyectList;
        }

        /* Returns a proyect by its id */
        this.getProyect = function(id) {
            for (i in proyectList){
                if (proyectList[i].id == id){
                    return proyectList[i];
                }
            }
        }

        /* Returns rol list */
        this.getRoles = function() {
            return rolList;
        }

        /* Returns a rol by its id */
        this.getRol = function(id) {
            for (i in rolList){
                if (rolList[i].id == id){
                    return rolList[i];
                }
            }
        }
    });
