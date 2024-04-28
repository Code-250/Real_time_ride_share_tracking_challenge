# Real-time Ride-Share Tracking🥳🚀

## Objective

Develop a web page, that utilizes the
Google Maps API to navigate a route. The
page should display the estimated time
to reach each upcoming stop.

## Installation Process

1.  clone the project

```bash
git clone https://github.com/Code-250/Real_time_ride_share_tracking_challenge.git

```

2.  Install all packages(Dependencies)

```bash
npm install
# or
yarn
```

3.  run the project locally through npm
    or yarn according to the package
    manager that you use

```bash
npm run dev
# or
yarn dev
```

## Approach used

## steps

1. set up the project using nextjs
   version 14 this was use in order to
   revelage the benefits that Nextjs
   comes with such as caching and better
   performance which allows the user to
   be able to have data faster.
2. install @react-google-maps/api which
   helped in rendering the google map
   and plotting specified stops

```bash
npm install --save @react-google-maps/api
```

3. through implementing the separation
   of concerns there are functions that
   helps to run and calculate Distances
   between the bus locationa and the
   nextStop of the bus

4. We have a function called
   useFetchDirections which is tasked to
   fetch the directions of the provided
   locations using google map
   DirectionsService.
5. Finally there is a component
   responsible to showcase the next stop
   and the distance and time it will
   take the bus to get to the next stop

🚨🚨🚨 : we have assumed that the bus is
moving at 40km/h as a speed

## Contributors

[Richard MUNYEMANA](https://github.com/code-250)
