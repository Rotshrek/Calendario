(function () {
    "use strict";

    var app = angular.module("mainApp", ["mwl.calendar", "ngAnimate", "ui.bootstrap", "colorpicker.module"]);

    app.factory("alert", ["$uibModal", function($uibModal) {
        function show(action, event) {
            return $uibModal.open({
                templateUrl: "views/modalContent.html",
                controller: function() {
                    var vm = this;
                    vm.action = action;
                    vm.event = event;
                },
                controllerAs: "vm"
            });
        }
        
        return {
            show: show
        };

    }]);

    app.config(['calendarConfig', function(calendarConfig) {

        calendarConfig.dateFormatter = 'moment';

    }]);

    app.controller("calendarController", ["moment", "calendarConfig", "alert", 
        function(moment, alert, calendarConfig) {
            moment.locale("es");

            var vm = this;
    
            vm.calendarView = "month";
            vm.viewDate = new Date();
            var actions = [{
                label: "<i class=\'glyphicon glpyhicon-pencil'></i>",
                onClick: function(args) {
                    alert.show ("Edited", args.calendarEvent);
                }
            }, {
                label: "<i class=\'glyphicon glpyhicon-pencil'></i>",
                onClick: function(args) {
                    alert.show ("Delted", args.calendarEvent);
                }
            }];
    
            vm.events = [
            {
                title: "Ejemplo de Evento",
                color: {
                    primary: '#e3bc08',
                    secondary: '#fdf1ba'
                },
                startsAt: moment().startOf("week").subtract(4, "days").add(8, "hours").toDate(),
                endsAt: moment().endOf("week").add(1, "week").add(8, "hours").toDate(),
                draggable: true,
                resizible: true,
                actions: actions
            }];
    
            vm.cellIsOpen = true;
    
            vm.addEvent = function () {
                vm.events.push ({
                    title: "New event", 
                    startsAt: moment().startOf("day").toDate(),
                    endsAt: moment().endOf("day").toDate(),
                    color: {
                    primary: '#e3bc08',
                    secondary: '#fdf1ba'
                    },
                    draggable: true,
                    resizible: true
                });
            };
    
            vm.eventClicked = function(event) {
                alert.show("Clicked", event)
            };
    
            vm.eventEdited = function(event) {
                alert.show("Edited", event)
            };
    
            vm.eventDeleted = function(event) {
                alert.show("Deleted", event)
            };
    
            vm.eventTimesChanged = function (event) {
                alert.show("Dropped or Resized", event)
            };
    
            vm.toggle = function($event, field, event) {
                $event.preventDefault();
                $event.stopPropagation();
                event[field] = !event[field];
            };
    
            vm.timespanClicked = function(date, cell) {
    
                if (vm.calendarView === "month") {
                    if ((vm.cellIsOpen && moment(date).startOf("day").isSame(moment(vm.viewDate).startOf("day"))) || cell.events.length === 0 || !cell.inMonth) {
                        vm.cellIsOpen = false;
                    } else {
                        vm.cellIsOpen = true;
                        vm.viewDate = date;
                    }
                } else if (vm.calendarView === "year") {
                    if ((vm.cellIsOpen && moment(date).startOf("month").isSame(moment(vm.viewDate).startOf("month"))) || cell.events.length === 0) {
                        vm.cellIsOpen = false;
                    } else {
                        vm.cellIsOpen = true;
                        vm.viewDate = date;
                    }
                }
            }
        }])    

})();
