define([],
	function () {
		function PriorityQueueSet(opts){
			this.comparator = opts.comparator;
			this.getKey = opts.key;
			if(this.getKey == null || this.comparator == null){
				console.log("key and comparator opts need to be set");
			}
			this.keys = {};
			this.storage = [];
		}

		PriorityQueueSet.prototype.queue = function(value, keepLowest){
			var key = this.getKey(value);
			if(this.keys[key] !== undefined){
				for(var i = 0; i < this.storage.length; ++i){
					if(this.getKey(this.storage[i]) != key){
					}
					else if(this.comparator(value, this.storage[i]) > 0 && keepLowest){
						return;
					}
					else{
						this.storage.splice(this.keys[i], 1);
						delete this.keys[key];
						break;
					}
				}
			}
			var i = 0,
				done = false;
			if(this.storage.length == 0){
				this.storage.splice(i, 0, value);
				this.keys[key] = true;
				return;
			}
			while(!done && i < this.storage.length){
				if(this.comparator(value, this.storage[i]) < 0){
					done = true;
				}
				else{
					++i;
				}
			}
			this.storage.splice(i, 0, value);
			this.keys[key] = true;
		}

		PriorityQueueSet.prototype.length = function(){
			return this.storage.length;
		}

		PriorityQueueSet.prototype.dequeue = function(value){
			var value = this.storage.shift();
			delete this.keys[this.getKey(value)];
			return value;
		}
		
		PriorityQueueSet.prototype.dump = function(){
			this.keys = {};
			this.storage = [];
		}
		
		return PriorityQueueSet;
	});