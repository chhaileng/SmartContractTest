'use strict';

class Car {

    constructor(carId, model, color, carNumber, owner) {
        if (this.validateCar(carId)) {
            this.carId = carId;
            this.model = model;
            this.color = color;
            this.carNumber = carNumber;
            this.owner = owner;
            this.createdDate = new Date();
            if (this.__isContract) {
                delete this.__isContract;
            }
            if (this.name) {
                delete this.name;
            }
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