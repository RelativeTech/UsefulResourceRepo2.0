// This snippet file was generated by processing the source file:
// ./analytics-next/index.js
//
// To make edits to the snippets in this file, please edit the source

// [START analytics_set_user_properties_modular]
import { getAnalytics, setUserProperties } from "firebase/analytics";

const analytics = getAnalytics();
setUserProperties(analytics, { favorite_food: 'apples' });
// [END analytics_set_user_properties_modular]