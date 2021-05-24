import { init } from './init'
import Fleet from './fleet'

const fleetManager = new Fleet();

const main = async () => {

    // grabs all the "types" and saves to the DB
    // these shouldn't change, so it will be slow the first run and then fast (cache) after that
    await init();

    while(true){
        // await Finances.makeDecisions();
        // await Contracts.makeDecisions();
        // await Router.makeDecisions();

        await fleetManager.makeDecisions();
        // IndustryManager.makeDecisions();

        // For Each Ship
            // loop
        
        // For Each Structure
            // loop
    }
}


main();


/********
financial manager queue loop:
	check for purchase requests
	priotize requests based on account state
		profit potential 
	process request responses based on priority		

contract requests queue loop:
	determine raw profit potential (later if implemented, all contracts right now are just to our structures)
	if not profitable, simply reject
        prioritize based on profit potential

router loop:
	get latest market prices
	check for contracts
		add as leg options based on profit potential (top priority always right now)
	for each ship (type / location)
		determine best loops
		publish / update mission assignment

ship management loop:
	check if we are approved to buy a ship
		buy ship
	check latest ships and locations
	check if we should sell a ship
	check if we should buy a ship
		request buying ship from financial manager

structure management loop:
	check if we are approved to buy a structure
		buy structure
	check if we should buy a structure
		request buying structure financial manager
 
structure loop:
	check if structure needs resupplied
		check if below some threshold (efficiency)
		check if we already have contract
			if not: add to contract request queue
	check if structure needs to export goods
		check if we are above some threshold
		check if we already have a contract
			if not: add to contract request queue
		
ship loop:
	check for new mission assignment
	confirm fuel availability on next leg (best effort)
	buy fuel needed & goods for trade
	travel leg
	confirm trade still profitable
	sell goods
	if contract
		mark completed in requests queue
 ************/