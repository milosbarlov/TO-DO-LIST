$(function(){

  Backbone.sync = function(method, model, success, error){
  success();
}

var Domlabel = Backbone.Model.extend({
	defaults: {
		headingText: "To Do List",
		placeholder: "What do you want to do ?",
		title: 'To-Do',
		buttonText: 'add'	
	}	
	});
  var Item = Backbone.Model.extend({
            defaults: {
	      part1: 'Add to do list',
	      domstart: '',
	      domend: '',
	      status: false 
              }
  });

  var List = Backbone.Collection.extend({
	model: Item	
  });

var ItemView = Backbone.View.extend({
	tagName: 'li',
	events: {
	   'click span.delete': 'remove',
	   'click span.data' : 'toggletask'
	},
	initialize: function(){
		_.bindAll(this, 'render', 'unrender', 'remove', 'complete', 'incomplete', 'toggletask');
		this.model.bind('change', this.render);
		this.model.bind('remove', this.unrender);
	},
	render: function(){
	  $(this.el).html('<span style="color:black; cursor:pointer;" class="data">'+ this.model.get('domstart') + this.model.get('part1')+ this.model.get('domend') +'</span> &nbsp; &nbsp; &nbsp; <span class="delete" style="cursor:pointer; color:red; font-family:sans-serif;">[delete]</span>');
	  return this;
	  },
	unrender: function() {
	  $(this.el).remove();
	},
	toggletask: function() {
		if(this.model.get('status')) {
                  this.incomplete();
		} else {
		this.complete();
		}
	},
	complete: function() {
	    this.model.set({domstart:'<del>', domend:'</del>',status:true});
	},
	incomplete: function() {
	     this.model.set({domstart:'', domend:'',status:false});
	},
	remove: function(){
	  this.model.destroy();	
	}	
});

  var ListView = Backbone.View.extend({
	el: $('body'),
	events: {
		'click button#add' : 'addItem',
                 'keyup input#todo' : 'addToDo'
	},
	initialize: function(){
	  _.bindAll(this, "render","addItem", "appendItem", "addToDo");

          this.label= new Domlabel();  
	  this.collection = new List();
	  this.collection.bind('add', this.appendItem);

	  this.counter = 0;
	  this.render();
	},
	render: function(){
	  var self = this;
	  $(this.el).append('<h2>' + this.label.get('headingText') + '</h2>');
          $(this.el).append('<input id="todo" name="todo" title=' + this.label.get('title') + ' placeholder='+ this.label.get('placeholder') +'/>');
	  $(this.el).append('<button id="add">' + this.label.get('buttonText') + '</button>');
	  $(this.el).append('<ul></ul>');	
	  _(this.collection.models).each(function(item){
			self.appendItem(item);		
		}, this);
	},
	addToDo: function(event){
		if(event.which == 13) this.addItem();
	},
	addItem: function(){
		this.counter++;
		var item = new Item();
		item .set({
		  part1: $('#todo').val()
		});
		$('#todo').val("");
		this.collection.add(item);
	},
	appendItem: function(item){
	    var itemView = new ItemView({
		model: item		
 		});
		$('ul', this.el).append(itemView.render().el);
	}
	
	});
var listView = new ListView();
});
