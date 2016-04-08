function SocialLinks(){
		var that = this;
		var social_checkboxes = [];
		var bs3_col = 'col-xs-6';
		var social_icons_boxes = [
			{
				name:'facebook',
				font_awesome:'fa fa-facebook-square',
			},
			{
				name:'twitter',
				font_awesome:'fa fa-twitter-square',
			},
			{
				name:'linkedin',
				label_text: 'LinkedIn',
				font_awesome:'fa fa-linkedin-square',
			},
			{
				name:'google-plus',
				label_text:'google+',
				font_awesome:'fa fa-google-plus-square',
			},
			{
				name:'instagram',
				font_awesome:'fa fa-linkedin-square',
			},
			{
				name:'youtube',
				label_text:'YouTube',
				font_awesome:'fa fa-linkedin-square',
			},
			{
				name:'dropbox',
				font_awesome:'fa fa-linkedin-square',
			},
			{
				name:'pinterest',
				font_awesome:'fa fa-linkedin-square',
			},
			{
				name:'tumblr',
				font_awesome:'fa fa-linkedin-square',
			},
			{
				name:'tripadvisor',
				font_awesome:'fa fa-facebook-square',
			},
			{
				name:'flickr',
				font_awesome:'fa fa-linkedin-square',
			},
			{
				name:'vine',
				font_awesome:'fa fa-linkedin-square',
			},
			{
				name:'digg',
				font_awesome:'fa fa-linkedin-square',
			},
			{
				name:'foursquare',
				font_awesome:'fa fa-linkedin-square',
			}
		];
		
		this.init = function(){
			this.initCheckboxes();
			var checkBoxes = $('#social-settings input[type="checkbox"]');
			this.setCheckboxes(checkBoxes);
			this.setInputDisabledEvent(checkBoxes);

			this.setEvents();
		}
		this.setInputDisabledEvent = function(){
			$('#social-settings').on('keyup change', 'input[type="text"]', function(e){
				if(!$(this).val()){ // input blank
					$(this).siblings().prop('disabled', true)	// disable
					return false;
				}

				if(!!configs.social_icons){
					// prop set and doesn't match current setting
					if(!!configs.social_icons[this.name] && this.value != configs.social_icons[this.name].url){
						$(this).siblings().prop('disabled', false)
					}else{
						$(this).siblings().prop('disabled', true)
					}
					if(!configs.social_icons[this.name]){	// not set yet
						$(this).siblings().prop('disabled', false)
					}
				}else{
					$(this).siblings().prop('disabled', false)
				}
			});
		}
		this.initCheckboxes = function(){
			if($('#social-settings').length){ 	// only rendered on public
				social_icons_boxes.forEach(function(o){
					social_checkboxes.push( new Checkbox(o, 'social-settings', {}) );
				});
			}
		}
		this.setCheckboxes = function(checkBoxes){
			if(!!configs.social_icons){
				var o = configs.social_icons;
				$.each(checkBoxes, function(k,v){
					// show "checked" boxes on screen
					if(!!o[this.name]){
						this.checked = true;
						that.showEditInputs(this, o[this.name].url)
					}else{
						this.check 		= false;
					}
				});
			}
		}
		this.showEditInputs = function(el, url){
			var name = el.name;
			// make textInput & buttons and append
			var div = document.createElement('div')
			div.className = 'check-input'
			var fieldset = document.createElement('fieldset')
			$(fieldset).attr('disabled', true)
			$(fieldset).addClass('not-allowed')
			//fieldset.className = 'text-center'
			var saveBtn = document.createElement('button')
			saveBtn.innerHTML = 'Save'
			saveBtn.className = 'form-control btn btn-success save'
			$(saveBtn).css({'width':'33%', 'height':'23px', 'font-size':'12px', 'padding':'0'})
			var cancelBtn = document.createElement('button')
			cancelBtn.innerHTML = 'Cancel'
			cancelBtn.className = 'form-control btn btn-danger cancel'
			$(cancelBtn).css({'width':'33%', 'height':'23px', 'font-size':'12px', 'padding':'0'})
			var textInput = document.createElement('input');
			textInput.type = "text";
			textInput.name = el.name;
			if(!!url){
				textInput.value = url;	
			}
			// append elements
			$(div).append($(textInput))
			$(div).append($(fieldset))
			$(fieldset).append($(saveBtn)).append($(cancelBtn))
			$(el).closest('.checkbox').after($(div))
		}
		this.disableBtns = function(btn){
			$(btn).parent().prop('disabled', true)
		}
		this.cancelClicked = function(e, btn){
			var input = $(btn).parent().siblings();
			// change input value back
			input.val(configs.social_icons[input.attr('name')].url)
			this.disableBtns(btn);
		}
		this.setEvents = function(){
			// Catch #social-settins Events
			$('#social-settings').on('Checkbox::social_icons', function(e, el){
				if(el.checked){
					that.showEditInputs(el);
				}else{
					if(!!configs.social_icons[el.name]){
						delete configs.social_icons[el.name]
						saveConfigs();
					}
					// Remove input - when checkbox unchecked
					$(el).closest('.checkbox').siblings('.check-input').remove();
				}
			});

			// fix Enter Key press on #social-settings
			$('#social-settings').on('keypress', 'input', function(e){
				var keyCode = e.keyCode || e.which;
				if(keyCode === 13){
					e.stopPropagation ? e.stopPropagation() : (e.cancelBubble=true);
					e.preventDefault();
					// trigger save click
					$(this).closest('.check-input').find('.save').trigger('click');
					return false;
				}
			});

			// Catch #social-settins .save & .cancel Events
			$('#social-settings').on('click', '.save, .cancel', function(e){
				e.stopPropagation ? e.stopPropagation() : (e.cancelBubble=true);
				e.preventDefault();
				// StopPropagation & Bubbling
				// 
				// Cancel clicked
				if($(this).hasClass('cancel')){
					that.cancelClicked(e, this);
				}else{
					// Save clicked
					var input = $(this).closest('.check-input').find('input')
					var social_url = input.val()
					if(!social_url){
						alert("Please don't leave input blank")
					}else{
						if(!configs.social_icons){
							configs.social_icons = {}
						}
						// save input
						configs.social_icons[input.attr('name')] = {'url':social_url}; // todo - put 
						saveConfigs();
						// todo - don't remove - just disable fieldset and remove save/cancel btns
						$(this).closest('.check-input').find('fieldset').attr('disabled', true);
					}
				}
				return false;	// dont need all the time
			});
		}
		// END Social Settings class
	}
