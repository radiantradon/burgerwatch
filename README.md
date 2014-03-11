burgerwatch
===========

Burgerwatch!

Hosted at http://stark-escarpment-8958.herokuapp.com/

The application is intended to show the location of food trucks in San Francisco on a map. The data is sourced from permit data published [here](https://data.sfgov.org/Permitting/Mobile-Food-Facility-Permit/rqzj-sfat).

This is a Flask app which pulls data from data/foodtruckdata.json and populates a google map from it. I chose not to use Backbone.js for ease and simplicity of development, although if I were to have more time to hone and debug I would use Backbone. I'd represent each one of the food trucks as a Backbone model, with each map marker being a Backbone view.

I chose the "full stack" route but the backend is fairly minimal:

API endpoints:
 * /trucks: returns a JSON object with all of the food trucks
 * /filtertrucks: returns a filtered list of all of the food trucks. You can include the following params:
  * 'exclude_catering' (bool): Filters out any business with the word "catering" in the title
  * 'filter_by_food_item' (str): Takes any string, sees if the string matches any words in the "FoodItems" column, returns a list of the food trucks that do match in a JSON format
  * 'truck_name' (str): Takes any string, sees if the string matches anything in the "Title" column, returns a list of matches in a JSON format

The frontend just consists of maps.js loading in markers from JSON, with a couple of callbacks attached to event handlers. All marker-loading is done through AJAX, no page-reloading is ever necessary. I saw that there were many duplicate food truck markers so I decided to highlight all of the food trucks of the same business name when one was selected.

In the future I'd like to collect locations for popular food trucks from their google calendars or twitter accounts and post where trucks might be on a certain day or time of day.

You can see another code project that makes words out of a set of letters, [code here] (https://github.com/radiantradon/bananagram) and [hosted here](http://secure-mountain-8277.herokuapp.com/). My personal website is at http://radiantradon.com.


