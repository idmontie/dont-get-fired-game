/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * This is the entry point for the NodeJS application
	 */
	if ( console && console.log ) {
	  console.log(
	    'The Julie Ann Wrigley Global Institute of Sustainability\n' +
	    'Copyright Arizona State University 2015\n' +
	    'Made by Capstone++\n'
	  );
	}

	var game  = __webpack_require__( 1 );
	var setup = __webpack_require__( 10 );

	setup();
	game();



/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var Game = __webpack_require__( 2 );

	var init = function() {
	  var game = new Game();
	  game.createGame();
	};

	module.exports = init;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var UiInterface = __webpack_require__( 3 );
	var MaterialManager = __webpack_require__( 4 );
	var ProductManager = __webpack_require__( 5 );
	var StoreManager = __webpack_require__( 6 );
	var Factory = __webpack_require__( 7 );
	var QuarterLog = __webpack_require__( 8 );
	var User = __webpack_require__( 9 );
	/**
	 * A Game
	 */
	var Game = function( options ) {
	  options = options || {};
	  this.quartersPast = options.quartersPast != undefined ? options.quartersPast : 0;
	  this.user = options.user != undefined ?
	      options.user :  new User( 'Tester', { totalIncome:20000 } );

	  this.materialManager = null;
	  this.productManager = null;
	  this.storeManager = null;

	  UiInterface.setGame( this );

	  //Setup
	  this.createGame = function() {
	    this.user.factories.push( new Factory( 'Start Factory' ) );
	    this.loadJson();
	  };
	  this.loadJson = function() {
	    var game = this;
	    $.getJSON( 'data/data.json', function( data ) {
	      game.materialManager = new MaterialManager( data.Materials );
	      game.productManager = new ProductManager( data.Products );
	      game.storeManager = new StoreManager( data.Stores );
	    } ).then( function( data ) {
	      game.runTest();
	    }
	    );

	  };

	  //Add
	  this.addMaterial = function( material, factory ) {
	    if ( materialManager.reserveMaterial( material ) ) {
	      factory.material = material;
	      user.materials.push( material );

	      //Update UI

	      return true;
	    } else {
	      return false;
	    }
	  };
	  this.addProduct = function( product, factory ) {
	    if ( product.setupcost > user.totalIncome ) {
	      return false;
	    }

	    if ( productManager.reserveProduct( material ) ) {
	      user.totalIncome -= product.setupcost;
	      factory.product = product;
	      user.products.push( product );

	      //Update UI

	      return true;
	    } else {
	      return false;
	    }

	  };
	  this.addStore = function( store, factory ) {
	    if ( this.storeManager.reserveStore( store ) ) {
	      factory.store = store;
	      this.user.stores.push( store );

	      //Update UI

	      return true;
	    } else
	    {
	      return false;
	    }
	  };
	  this.addFactory = function( ) {

	    if ( 10 > user.totalIncome ) {
	      return false;
	    } else {
	      user.totalIncome -= 10;
	      user.factories.push( new Factory() );

	      //Update UI

	      return true;
	    }
	  };

	  //Perception
	  this.getPerception = function() {

	    return 1;
	  };

	  //Quarter
	  this.runQuarter = function() {

	    var currentPerception = this.getPerception();
	    var totalIncome = 0;
	    var totalWaste = 0;
	    var totalItemsSold = 0;
	    var totalConsumerPaid = 0;

	    //loop though all factories
	    for ( var i = 0; index < this.user.factories.length; i++ ) {
	      var factory  = this.user.factories[ i ];

	      if ( factory.store != null )
	      {

	        //Requested From Store
	        var totalRequested =
	            factory.store.baseBuyRateForProducts * currentPerception;

	        //Make Products
	        var costPerProduct =
	            factory.material.costPerPound * factory.product.materialDependency.amount;
	        while ( factory.totalInventory < totalRequested &&
	        costPerProduct <= this.user.totalIncome ) {
	          this.user.totalIncome -= costPerProduct;
	          totalWaste += factory.material.wastePerPound * factory.product.materialDependency.amount;
	          totalIncome -= costPerProduct;
	          factory.totalInventory++;
	        }

	        //Sell To Store
	        var amount = 0;
	        if ( factory.totalInventory > totalRequested ) {
	          amount = totalRequested;
	        } else {
	          totalRequested = this.user.factories[ i ].totalInventory;
	        }
	        factory.totalInventory +=  amount;
	        totalIncome += store.pricePerProduct * amount;
	        totalItemsSold += amount;
	        totalConsumerPaid += store.pricePerProduct * amount;
	        totalWaste += store.wastePerProduct * amount;
	        factory.totalInventory -= amount;
	      }

	    }

	    //Generate Quarter Log
	    var quarterLog = new QuarterLog( totalItemsSold, totalConsumerPaid, totalWaste, totalIncome );
	    user.quarterLog.push( quarterLog );

	    //Quarters Past
	    this.quartersPast++;

	    //Update UI
	  };

	  //Add
	  this.addMaterial = function( material, factory ) {
	    if ( this.materialManager.reserveMaterial( material ) ) {
	      factory.material = material;
	      this.user.materials.push( material );

	      //Update UI

	      return true;
	    }
	  };
	  this.addProduct = function( product, factory ) {
	    if ( product.setupCost > this.user.totalIncome ) {
	      return false;
	    }

	    if ( this.productManager.reserveProduct( product ) ) {
	      this.user.totalIncome -= product.setupCost;
	      factory.product = product;

	      //Update UI

	      return true;
	    }

	  };
	  this.addStore = function( store, factory ) {
	    if ( this.storeManager.reserveStore( store ) ) {
	      factory.store = store;
	      this.user.stores.push( store );

	      //Update UI

	      return true;
	    }
	  };
	  this.addFactory = function( ) {

	    if ( 10 > this.user.totalIncome ) {
	      return false;
	    } else {
	      this.user.totalIncome = this.user.totalIncome - 10;
	      this.user.factories.push( new Factory() );

	      //Update UI

	      return true;
	    }
	  };

	  //Perception
	  this.getPerception = function() {

	    return 1;
	  };

	  //Quarter
	  this.runQuarter = function() {
	    console.log( 'Run Start' );
	    var currentPerception = this.getPerception();
	    var totalIncome = 0;
	    var totalWaste = 0;
	    var totalItemsSold = 0;
	    var totalConsumerPaid = 0;

	    //loop though all factories
	    for ( var i = 0; i < this.user.factories.length; i++ ) {

	      var factory = this.user.factories[ i ];
	      console.log( 'Factory:' + factory );

	      if ( factory.store != null ) {

	        //Requested From Store
	        console.log( 'BaseBuyRateForProducts:' + factory.store.baseBuyRateForProducts );
	        console.log( 'currentPerception:' + currentPerception );

	        var totalRequested = Math.floor( factory.store.baseBuyRateForProducts * currentPerception );
	        console.log( 'TotalRequested:' + totalRequested );

	        //Make Products
	        var costPerProduct =
	            factory.material.costPerPound * factory.product.materialDependency.amount;

	        console.log( 'Cost Per Product:' + costPerProduct );

	        while ( factory.totalInventory < totalRequested &&
	        costPerProduct <= this.user.totalIncome ) {
	          this.user.totalIncome -= costPerProduct;
	          totalWaste += factory.material.wastePerPound * factory.product.materialDependency.amount;
	          totalIncome -= costPerProduct;
	          factory.totalInventory++;

	        }
	        console.log( 'TotalInventory:' + factory.totalInventory );

	        //Sell To Store
	        var amount = 0;

	        if ( factory.totalInventory > totalRequested ) {
	          amount = totalRequested;
	        } else {
	          amount = factory.totalInventory;
	        }
	        console.log( 'Amount:' + amount );

	        factory.totalInventory +=  amount;
	        totalIncome += factory.store.pricePerProduct * amount;
	        totalItemsSold += amount;
	        totalConsumerPaid += factory.store.pricePerProduct * amount;
	        totalWaste += factory.store.wastePerProduct * amount;
	        this.user.factories[ i ].totalInventory -= amount;
	      } else {
	        console.log( 'No Store ' );
	      }
	      console.log( '' );
	    }

	    //Generate Quarter Log
	    var quarterLog = new QuarterLog( totalItemsSold, totalConsumerPaid, totalWaste, totalIncome );
	    this.user.quarterLog.push( quarterLog );

	    //Quarters Past
	    this.quartersPast++;

	    //Update UI

	    console.log( 'Run End' );
	  };

	  //Tests
	  this.runTest = function() {
	    this.showGameObject();
	    this.checkSetup();
	    this.checkLoadJson();
	    this.checkAddMaterial();
	    this.checkAddProduct();
	    this.checkAddStore();
	    this.checkAddFactory();
	    this.checkRunQuarter();
	    this.checkRunQuarter();
	    this.checkRunQuarter();
	    this.checkRunQuarter();
	    this.checkRunQuarter();
	  };

	  this.showGameObject = function() {
	    console.log( 'Game' );
	    console.log( '---------' );
	    console.log( this );
	    console.log( '' );
	  };

	  this.checkSetup = function() {
	    console.log( 'Setup ' );
	    console.log( '---------' );
	    console.log( 'User' );
	    var userCurrent = jQuery.extend( true, {}, this.user );
	    console.log( userCurrent );
	    console.log( '' );
	  };
	  this.checkLoadJson = function() {

	    var getAvailableMaterialsCurrent = jQuery.extend( true, {},
	        this.materialManager.getAvailableMaterials()  );
	    var getAvailableProductsCurrent = jQuery.extend( true, {},
	        this.productManager.getAvailableProducts()  );
	    var getAvailableStoresCurrent = jQuery.extend( true, {},
	        this.storeManager.getAvailableStores()  );

	    console.log( 'Load Json' );
	    console.log( '---------' );
	    console.log( 'Materials' );
	    console.log( getAvailableMaterialsCurrent );
	    console.log( 'Products' );
	    console.log( getAvailableProductsCurrent );
	    console.log( 'Stores' );
	    console.log( getAvailableStoresCurrent );
	    console.log( '' );
	  };
	  this.checkAddMaterial = function() {
	    console.log( 'Add Material' );
	    console.log( '---------' );
	    console.log( 'Material' );
	    console.log(  this.materialManager.getAvailableMaterials()[ 0 ] );
	    console.log( 'Factory' );
	    console.log(  this.user.factories[ 0 ] );
	    console.log( 'AddMaterial()' );
	    this.addMaterial( this.materialManager.getAvailableMaterials()[ 0 ],
	        this.user.factories[ 0 ] );
	    console.log( 'Available Materials' );
	    var getAvailableMaterialsCurrent = jQuery.extend( true, {},
	        this.materialManager.getAvailableMaterials() );
	    console.log( getAvailableMaterialsCurrent );
	    console.log( 'User' );
	    var userCurrent = jQuery.extend( true, {}, this.user );
	    console.log( userCurrent );
	    console.log( '' );
	  };
	  this.checkAddProduct = function() {
	    console.log( 'Add Product' );
	    console.log( '---------' );
	    console.log( 'Product' );
	    console.log(  this.productManager.getAvailableProducts()[ 0 ] );
	    console.log( 'Factory' );
	    console.log(  this.user.factories[ 0 ] );
	    console.log( 'AddProduct()' );
	    this.addProduct( this.productManager.getAvailableProducts()[ 0 ],
	        this.user.factories[ 0 ] );
	    console.log( 'Available Products' );
	    var getAvailableProductsCurrent = jQuery.extend( true, {},
	        this.productManager.getAvailableProducts() );
	    console.log( getAvailableProductsCurrent );
	    console.log( 'User' );
	    var userCurrent = jQuery.extend( true, {}, this.user );
	    console.log( userCurrent );
	    console.log( '' );
	  };
	  this.checkAddStore = function() {
	    console.log( 'Add Store' );
	    console.log( '---------' );
	    console.log( 'Store' );
	    console.log(  this.storeManager.getAvailableStores()[ 0 ] );
	    console.log( 'Factory' );
	    console.log(  this.user.factories[ 0 ] );
	    console.log( 'AddStore()' );
	    this.addStore( this.storeManager.getAvailableStores()[ 0 ],
	        this.user.factories[ 0 ] );
	    console.log( 'Available Stores' );
	    var getAvailableStoresCurrent = jQuery.extend( true, {},
	        this.storeManager.getAvailableStores() );
	    console.log( getAvailableStoresCurrent );
	    console.log( 'User' );
	    var userCurrent = jQuery.extend( true, {}, this.user );
	    console.log( userCurrent );
	    console.log( '' );
	  };
	  this.checkAddFactory = function() {
	    console.log( 'Add Factory' );
	    console.log( '---------' );
	    console.log( 'User' );
	    var userCurrentBefore = jQuery.extend( true, {}, this.user );
	    console.log( userCurrentBefore );
	    console.log( 'AddFactory()' );
	    this.addFactory();
	    console.log( 'User' );
	    var userCurrentAfter = jQuery.extend( true, {}, this.user );
	    console.log( userCurrentAfter );
	    console.log( '' );
	  };
	  this.checkRunQuarter = function() {
	    console.log( 'Run Quarter' );
	    console.log( '---------' );
	    var userCurrent = jQuery.extend( true, {}, this.user );
	    console.log( 'User' );
	    console.log(  userCurrent );
	    console.log( 'RunQuaterLog' );
	    this.runQuarter();
	    console.log( 'User' );
	    var userCurrentAfter = jQuery.extend( true, {}, this.user );
	    console.log( userCurrentAfter );
	    console.log( 'QuaterLog' );
	    console.log( this.user.quarterLog[ this.user.quarterLog.length - 1 ] );
	    console.log( '' );
	  };
	};

	module.exports = Game;


/***/ },
/* 3 */
/***/ function(module, exports) {

	var UIInterface = ( function() {
	  var _game = null;

	  var setGame = function( game ) {
	    _game = game;
	  };

	  // TODO get the factory by it's id and get appropriate menu items
	  var getMenuItemList = function( factoryId ) {
	    var mFactory = getFactoryById( factoryId );
	    return itemsArray;

	  };

	  var rePaint = function() {

	    // var currentGameState = game;
	    this.setQuarterValue( currentGameState.quartersPast );
	    this.setYearValue( currentGameState.quartersPast );
	    this.setPerceptionValue( currentGameState.getPerception() );
	    this.setGoals( currentGameState.getGoals() );
	  };

	  // Sets the Quarter value in the UI
	  var setQuarterValue = function( quarter ) {
	    quarter++;
	    $( '#quarterValue' ).text( quarter );
	  };

	  // Sets the Year value in the UI
	  var setYearValue = function( quarters ) {
	    var year = quarters / 4;
	    $( '#yearValue' ).text( year );
	  };

	  // Sets the "Bar Graph" value in the UI. Currently treated as a percentage
	  var setTimeProgressValue = function( percent ) {
	    $( '#timeProgressValue' ).text( percent );
	  };

	  // Sets the "Bar Graph" value in the UI. Currently treated as a percentage
	  var setPerceptionValue = function( perception ) {
	    $( '#perceptionValue' ).text( perception );
	  };

	  var setGoals = function( goals ) {
	    goals.forEach( function( goal ) {
	      $( '#goalsValue' ).append( '<div>' + goal + '</div>' );
	    } );
	  };

	  var nextTick = function() {

	    // call next Tick;
	  };

	  var nextQuarter = function() {

	    // game.runQuarter();
	  };

	  return {
	    getMenuItemList: getMenuItemList,
	    rePaint: rePaint,
	    setQuarterValue: setQuarterValue,
	    setYearValue: setYearValue,
	    setTimeProgressValue: setTimeProgressValue,
	    setPerceptionValue: setPerceptionValue,
	    setGoals: setGoals,
	    nextTick: nextTick,
	    nextQuarter: nextQuarter,
	    setGame: setGame
	  };
	} )();

	module.exports = UIInterface;


/***/ },
/* 4 */
/***/ function(module, exports) {

	/**
	 * A Material Manager
	 */
	var MaterialManager = function( materials ) {
	  var _materials = materials;
	  var _availableMaterials = materials;

	  /**
	   * If the material is available, returns true and
	   * removes the function from the available materials
	   *
	   * Otherwise, return false.
	   */
	  var reserveMaterial = function( material ) {
	    if ( _availableMaterials != null ) {
	      for ( var index = 0; index < _availableMaterials.length; index++ ) {
	        if ( _availableMaterials[ index ] === material ) {
	          _availableMaterials.splice( index, 1 );

	          return true;
	        }
	      }
	    }

	    return false;
	  };

	  var getAvailableMaterials = function() {
	    return _availableMaterials;
	  };

	  return {
	    reserveMaterial: reserveMaterial,
	    getAvailableMaterials: getAvailableMaterials
	  };
	};

	module.exports = MaterialManager;



/***/ },
/* 5 */
/***/ function(module, exports) {

	/**
	 * A Product Manager
	 */
	var ProductManager = function( products ) {
	  var _products = products;
	  var _availableProducts = products;

	  var reserveProduct = function( product ) {
	    if ( _availableProducts  != null ) {
	      for ( var index = 0; index < _availableProducts.length; index++ ) {
	        if ( _availableProducts[ index ] === product ) {
	          _availableProducts.splice( index, 1 );

	          return true;
	        }
	      }
	    }

	    return false;
	  };

	  var getAvailableProducts = function() {
	    return _availableProducts;
	  };

	  return {
	    reserveProduct: reserveProduct,
	    getAvailableProducts: getAvailableProducts
	  };
	};

	module.exports = ProductManager;


/***/ },
/* 6 */
/***/ function(module, exports) {

	/**
	 * A Store Manager
	 */
	var StoreManager = function( stores ) {
	  var _stores = stores;
	  var _availableStores = stores;

	  var reserveStore = function( store ) {
	    if ( _availableStores  != null ) {
	      for ( var index = 0; index < _availableStores.length; index++ ) {
	        if ( _availableStores[ index ] === store ) {
	          _availableStores.splice( index, 1 );

	          return true;
	        }
	      }
	    }

	    return false;
	  };

	  var getAvailableStores = function() {
	    return _availableStores;
	  };

	  return {
	    reserveStore: reserveStore,
	    getAvailableStores: getAvailableStores
	  };
	};
	module.exports = StoreManager;


/***/ },
/* 7 */
/***/ function(module, exports) {

	/**
	 * A Factory
	 */
	var Factory = function( name, options ) {
	  options = options || {};

	  this.name = name;
	  this.product = options.product || null;
	  this.material = options.material || null;
	  this.store = options.store || null;
	  this.totalInventory = options.totalInventory || 0;
	};

	module.exports = Factory;


/***/ },
/* 8 */
/***/ function(module, exports) {

	var QuarterLog = function( totalItemsSold, totalConsumerPaid, totalWaste, totalIncome ) {
	  this.totalItemsSold = totalItemsSold;
	  this.totalConsumerPaid = totalConsumerPaid;
	  this.totalWaste = totalWaste;
	  this.totalIncome = totalIncome;
	};
	module.exports = QuarterLog;


/***/ },
/* 9 */
/***/ function(module, exports) {

	var User = function( name, options ) {
	  options = options || {};

	  this.name = name;
	  this.quarterLog = options.quarterLog || [];
	  this.factories = options.factories || [];
	  this.materials = options.materials || [];
	  this.stores = options.stores || [];
	  this.totalIncome = options.totalIncome || 0;
	  this.totalWaste = options.totalWaste || 0;
	};

	module.exports = User;


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	var UiInterface = __webpack_require__( 3 );

	var setup = function() {
	  var $gameContainer = $( '#game-container' );
	  var $factoryEntity = $( '<div />',
	      {
	        class: 'factory_entity',
	        html: 'Factory',
	        id: 'initialFactory'
	      } );

	  $factoryEntity.click( function() {
	    var menuItemList = getMenuItemList( this.id );
	  } );

	  var $quarterYear = '<div>Quarter <span id="quarterValue">1</span> / ' +
	      'Year <span id="yearValue">0</span> ' +
	      '[<span id="timeProgressValue">1</span>]</div>';

	  var $funds = '<div>Funds $<span id="totalFundsValue">000000</span> - ' +
	      '<span id="fundsLostPerQuarterValue">0000</span> / Quarter</div>';

	  var $perception = '<div>Perception <span id="perceptionValue">1</span>00</div>';

	  var $goals = '<div id="goalsValue">Goals: <div>none</div></div>';

	  var $nextTick = $( '<button />',
	      {
	        text: 'Next Tick'
	      } );
	  $nextTick.click( function() {
	    UiInterface.nextTick();
	  } );

	  var $nextQuarter = $( '<button />',
	      {
	        text: 'Next Quarter'
	      } );
	  $nextQuarter.click( function() {
	    UiInterface.nextQuarter();
	  } );

	  $gameContainer.append( $factoryEntity, '<hr>', $quarterYear, $funds, $perception, $goals );
	  $gameContainer.append( $nextTick, $nextQuarter );
	};

	module.exports = setup;


/***/ }
/******/ ]);