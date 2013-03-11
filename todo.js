$(function(){

  Backbone.sync = function(method, model, success, error){
  success();
}

var Domlabel = Backbone.Model.extend({
	defaults: {
		headingText: "To Do List",
		placeholder: "What do you want to do ?",
		title: 'To-Do',
		buttonAddText: 'add',
		buttonSaveText: 'save'
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

var ItemListName = Backbone.Model.extend({
		defaults: {
		  nameValue: "todoItem",
		  visible: false
		}
	});
  var List = Backbone.Collection.extend({
	model: Item	
  });

var ItemView = Backbone.View.extend({
	tagName: 'li',
	events: {
	   'click span.data' : 'toggletask'
	},
	initialize: function(){
		_.bindAll(this, 'render', 'unrender', 'complete', 'incomplete', 'toggletask');
		this.model.bind('change', this.render);
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

var ItemInput = Backbone.View.extend({
	tagName : 'input',
	initialize: function() {
		_.bindAll(this, 'render', 'unrender');
		this.itemDetail = new ItemListName();
	},
	render: function() {
		if(!this.itemDetail.get("visible"))
		$(this.el).hide();
		$(this.el).attr('name', this.itemDetail.get("nameValue"));
		$(this.el).attr('value', this.model.get("part1"));
		return this;
	},
	unrender: function() {
		$(this.el).remove();
	},
	remove: function() {
		this.model.destroy();
	},
});

var ItemDiv = Backbone.View.extend({
	tagName : 'div',
	events: {
	   'click li span.delete': 'remove',
	},
	initialize: function() {
		_.bindAll(this, 'render', 'unrender', 'remove');
		this.model.bind('remove', this.unrender);
	},
	render: function() {
	    var itemView = new ItemView({
		model: this.model		
 		});
	    var itemInput = new ItemInput({
		model: this.model		
 		});
		$(this.el).append(itemView.render().el);
		$(this.el).append(itemInput.render().el);
		return this;
	},
	unrender: function() {
		$(this.el).remove();
	},
	remove: function() {
		this.model.destroy();
	},
});

  var ListView = Backbone.View.extend({
	el: $('body'),
	events: {
		'click button#add' : 'addItem',
		'click button#save' : 'saveItem',
                 'keyup input#todo' : 'addToDo'
	},
	initialize: function(){
	  _.bindAll(this, "render","addItem", "appendItem", "addToDo");

          this.label= new Domlabel();  
	  this.collection = new List();
	  this.collection.bind('add', this.appendItem);
	  this.collection.bind('save', this.saveItem);
	  this.counter = 0;
	  this.render();
	},
	render: function(){
	  var self = this;
	  $(this.el).append('<h2>' + this.label.get('headingText') + '</h2>');
      $(this.el).append('<input id="todo" name="todo" title=' + this.label.get('title') + ' placeholder='+ this.label.get('placeholder') +'/>');
	  $(this.el).append('<button id="add">' + this.label.get('buttonAddText') + '</button>');
 	  $(this.el).append('<button id="save">' + this.label.get('buttonSaveText') + '</button>');
	  $(this.el).append('<ul></ul>');	
	  _(this.collection.models).each(function(item){
			self.appendItem(item);		
		}, this);
	},
	addToDo: function(event){
		if(event.which == 13) this.addItem();
	},
	saveItem: function(){
		var saveString = " ";
		for(var i=0; i< this.collection.models.length; i++) {
			saveString = saveString + this.collection.models[i].get("part1") + "\n";
		}
		alert(saveString);
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
	    var itemDiv = new ItemDiv({
		model: item		
 		});
		$('ul', this.el).append(itemDiv.render().el);
	}
	
	});
var listView = new ListView();
});
