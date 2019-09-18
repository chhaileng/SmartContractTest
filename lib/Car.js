'use strict';

const md5 = require('md5');

class Car {

    constructor(carId, model, color, plateNumber, owner) {
        if (this.validateCar(carId)) {
            this.carId = md5(carId).substring(0,10).toUpperCase();
            this.model = model;
            this.color = color;
            this.plateNumber = plateNumber;
            this.owner = owner;
            this.createdDate = new Date();
            // if (this.__isContract) {
            //     delete this.__isContract;
            // }
            // if (this.name) {
            //     delete this.name;
            // }
            return this;
        } else {
            throw new Error('Car ID is not valid.')
        }
    }

    async validateCar(carId) {
        if (carId) {
            return true;
        } else {
            return false;
        }
    }

}

module.exports = Car;