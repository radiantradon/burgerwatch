burgerwatch
===========

Burgerwatch!

The application is intended to show the location of food trucks in San Francisco on a map. The data is sourced from permit data published [here](https://data.sfgov.org/Permitting/Mobile-Food-Facility-Permit/rqzj-sfat).

This is a Flask app which pulls data from data/foodtruckdata.json and populates a google map from it. I chose not to use Backbone.js for ease and simplicity of development, although if I were to have more time to hone and debug I represent each one of the food trucks as a Backbone model, with each map marker being a Backbone view.

I chose the "full stack" route but the backend is fairly minimal:

API endpoints:
 * /trucks: returns a JSON object with all of the food trucks 
 * /filtertrucks: returns a filtered list of all of the food trucks. You can include the following parameters:
  * 'exclude_catering' true/'': Filters out any business with the word "catering" in the title
  * 'filter_by_food_item': Takes any string, sees if the string matches any words in the "FoodItems" column, returns a list of the food trucks that do match in a JSON format
  * 'truck_name': Takes any string, sees if the string matches any sub-string in the "Title" column, returns a list of matches in a JSON format
  
  
All marker-loading is done through AJAX.


