'use strict';

// import Hyperledger Fabric 1.4 SDK
const { Contract } = require('fabric-contract-api');

let Car = require('./Car.js');

class MyContract extends Contract {

    async init(ctx) {
        console.log('Instantiate was called');
        let cars = [];

        let car1 = await new Car('CAR1', 'Lexus', 'white', '9e95ba27836257bdcb5b001de8f650b6', 'Kok Dara');
        let car2 = await new Car('CAR2', 'Ford', 'white', '8862ca684751f4e83d5fbfc728bbd8b4', 'Kok Sva');
        let car3 = await new Car('CAR3', 'Toyota', 'white', '5a888c6121932f8a0822424e034d4628', 'Kok Kdam');
        let car4 = await new Car('CAR4', 'Rang Rover', 'white', 'f786d8f1624dc424b538209d268dfcfa', 'Kok Jma');
        let car5 = await new Car('CAR5', 'Pruis', 'white', 'c749ef37a3a388d67b79d2029daeaa7b', 'Kok Bopha');

        cars.push(car1);
        cars.push(car2);
        cars.push(car3);
        cars.push(car4);
        cars.push(car5);

        await ctx.stub.putState(car1.carId, Buffer.from(JSON.stringify(car1)));
        await ctx.stub.putState(car2.carId, Buffer.from(JSON.stringify(car2)));
        await ctx.stub.putState(car3.carId, Buffer.from(JSON.stringify(car3)));
        await ctx.stub.putState(car4.carId, Buffer.from(JSON.stringify(car4)));
        await ctx.stub.putState(car5.carId, Buffer.from(JSON.stringify(car5)));

        return cars;
    }

}