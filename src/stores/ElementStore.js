import Reflux from 'reflux';
import ElementActions from '../actions/ElementActions';

var _data;
var _saveUrl;

var ElementStore = Reflux.createStore({
    init: function() {
        this.listenTo(ElementActions.createElement,     this._create);
        this.listenTo(ElementActions.deleteElement,     this._delete);
        this.listenTo(ElementActions.save,              this.save);
        this.listenTo(ElementActions.updateElements,    this._updateElements)
    },

    load: function(urlOrData, saveUrl) {

        var self = this;
        _saveUrl = saveUrl;

        if(typeof urlOrData == 'string' || urlOrData instanceof String) {
            $.ajax({
                url: urlOrData,
                success: function(data) {
                    _data = data;
                    self.trigger(_data);
                }
            })
        } else {
            _data = urlOrData;
            self.trigger(_data);
        }
    },

    _create: function(element) {
        if(element.isUnique) {
            var exists = _.find(_data, {element: element.element});

            if(exists) {
                alert('This field has a unique constraint, and is already in use on this form.');
                console.warn('Unique Field Constraint Violation: ' + element.element);
                return;
            }
        }

        _data.push(element);
        this.trigger(_data);
    },

    _delete: function(element) {
        var index = _.findIndex(_data, {id: element.id});
        _data.splice(index, 1);
        this.trigger(_data);
    },

    _updateElements: function(elements) {
        _data = elements;
        this.trigger(_data);
    },

    /**
    * Make sure that the fields we have on this form all have unique field names
    * @return {boolean} Whether or not all our field names are unique
    */
    validateElements: function() {
        var names = {};
        var unique = true;

        _data.forEach(element => {
            if (element.name !== undefined && names[element.name] !== undefined) {
                unique = false;
            }

            names[element.name] = true;
        });

        return unique;
    },

    /**
     * Validate the form and post to the _saveUrl if we were initialized with one
     * Log out the data if no URL was provided
     */
    save: function(onSave, onSaveError) {
        if (this.validateElements()) {
            if (_saveUrl) {
                $.ajax({
                    type: 'POST',
                    url: _saveUrl,
                    data: {
                        data: JSON.stringify(_data)
                    },
                    dataType: 'json',
                    success: function(data) {
                        if (onSave) {
                            onSave(data);
                        }
                    },
                    error: function(jqXHR, status) {
                        if (onSaveError) {
                            onSaveError(status);
                        }
                    }
                })
            } else {
                console.log(JSON.stringify(_data));
                if (onSave) {
                    onSave(JSON.stringify(_data));
                }
            }
        } else {
            if (onSaveError) {
                onSaveError('All input fields must have unique names');
            }

            this.trigger(
                {
                    error: 'All input fields must have unique names'
                }
            );
        }
    }

});

module.exports = ElementStore;
