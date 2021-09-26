---
title: Tide gauge data
date: "2020-10-14T09:22:00.000Z"
description: |
    We integrate new data sources into our software systems all the time, and thought it would be a good idea to start documenting the how and why. This one describes tide gauge data from NOAA.
tags: ["tides", "react", "noaa", "data", "shade", "mapbox"]
---
## Concept 
In a perfect world, I would know the tides before going out on the water. But I forget all the time. 

I've worked with teams that operated entirely around the tides, and others that operated regardless of tides. In the Northeast the tides are a constant feature, while in Louisiana they barely exist.

The historical data are useful for providing context to events. Tide gauges are also more generally water level gauges, which mean that they include storm surge and wind-influenced levels.

Real-time data is an aid to navigation.

Future conditions can help plan operations and assess risk. Let's no get into sea level rise though.

## Source
US water levels are available from [NOAA Tides & Currents](https://tidesandcurrents.noaa.gov/stations.html?type=Water+Levels#Maine). Your tax dollars at work. 

There are 6 stations in Maine. These generally also have metocean data associated with them, like wind, air pressure, and water temperature. 

Lucky for us the Tides & Currents API is [documented](https://api.tidesandcurrents.noaa.gov/api/prod/)! Unfortunately, the responses are not really self-describing. "What do the letters in the data columns represent?" asks their own [help](https://api.tidesandcurrents.noaa.gov/api/prod/responseHelp.html) page. Great. If you feel defensive about your own API design, you might want to reconsider your choices. 

Doesn't seem like you can request with a geographic range.

Looking at the network requests trigger by a map load, you can see that all the stations are retrieved from a metadata API (`/mdapi/prod`), and then each is populated with individual requests to the core API (`/api/prod`). FYI, it's SOAP/XML underneath a JSON friendly wrapper. 

The [docs](https://api.tidesandcurrents.noaa.gov/mdapi/prod/) for the metadata API indicate that yes indeed you can search by radius! 

But, only when requesting a specific station. In other words, you can return `nearby` stations as part of the request for a named station. Useful for comparisons and topological queries.

So, we absolutely must get all stations, and then filter them in the client. Fine NOAA. They "expand" linked data by default, but let's not do that. This initial request only takes 55 ms, and can definitely be cached. But it also moves 600KB of data just to get references to 11 links that I need to follow. 

The docs describe all of the query parameters for fetching the actual data. 

There are many time interval options. Some time based query parameter is required. Use `date=latest` for a single observation, or `range=24` for past day. 

You also have to explicit declare a `product` value or array, `datum`, `time_zone`, `units`. Let's use Mean Lower Low Water (`mllw`) cause it's the default. We'll go with daylight savings local time, and metric.

They want you to provide information about the accessing `application`. This is good form, gotta justify providing public data with tax money.

The final thing is:
```
https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?date=latest&station=8454000&product=water_level&datum=mllw&units=metric&time_zone=lst_ldt&application=oceanics.io&format=json
```

## Using with Mapbox and React

Our stations query (as a React hook) is something like:

```TypeScript
const EXTENT = [-71.190, 40.975, -63.598, 46.525];
const metadata_url = "https://api.tidesandcurrents.noaa.gov/mdapi/prod/webapi/stations.json?type=waterlevels";
const data_url = "https://api.tidesandcurrents.noaa.gov/api/prod/datagetter";

const cropToExtent = (extent) => ({lat, lng}) =>
  lng >= extent[0] && lng <= extent[2] && lat >= extent[1] && lat <= extent[3];

useEffect(() => {
  map.addImage(id, ANIMATED_ICON, { pixelRatio: 4 });

  (async () => {
    const {stations} = await fetch(metadata_url).then(r => r.json());
    const queue: Promise<object>[] = stations
      .filter(cropToExtent(EXTENT))
      .map(({id}) =>
        fetch(
          `${data_url}?date=latest&station=${id}&product=water_level&datum=mllw&units=metric&time_zone=lst_ldt&application=oceanics.io&format=json`
        ).then(r => r.json())
      );
    map.addLayer({
      id,
      type: "symbol",
      source: parseFeatureData({
        features: await Promise.all(queue), 
        standard: "noaa"
      }),
      layout: {"icon-image": "tidal-stations"}
    });     
  })();
}, []);
```

We're waiting for the Mapbox data structure to load, as well as some HTML canvas based icons to create a custom symbol layer on the map.

Station metadata is retrieved then filtered down to only the stations within a bounding box. This could be any spatial query!

The selected stations are queried and then these are parsed into a GeoJSON FeatureCollection embedded in a GeoJSON layer Mapbox source object. The parsing function `parseFeatureData` is omitted here. The `ANIMATED_ICON` is a canvas routine to draw a changing level indicator. 

The problem is that you only get one datum per request, like Mean Lowest Low Water (`mllw`), but you need two to be able to render a progress-bar style of gauge. 

So another request the `datums` product for every location before you can paint the map. Blech!