import mapboxGl from 'mapbox-gl';
import React, { useEffect, useRef } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';

import { useStyles } from './styles';

const MAPBOX_TOKEN =
  'pk.eyJ1IjoiZ2FuZGJveTkxIiwiYSI6ImNrY2JocGg2NjBqMWwycnVuYWc2ajd3aG0ifQ.AGS0xNyYUjeU7V5t_piejg';
mapboxGl.accessToken = MAPBOX_TOKEN;

const schoolLatLng = [82.948911, 55.019997];

const Map = () => {
  const classes = useStyles();

  const containerRef = useRef(null);
  const map = useRef(null);

  useEffect(() => {
    const mapInstance = new mapboxGl.Map({
      container: containerRef.current,
      style: 'mapbox://styles/mapbox/light-v10',
      center: schoolLatLng,
      zoom: 13,
    });

    mapInstance.on('load', () => {
      mapInstance.addLayer({
        id: 'buildings3d',
        type: 'fill-extrusion',
        source: 'composite',
        'source-layer': 'building',
        minzoom: 15,
        paint: {
          'fill-extrusion-color': '#aaa',
          'fill-extrusion-height': [
            'interpolate',
            ['linear'],
            ['zoom'],
            15,
            0,
            15.05,
            ['get', 'height'],
          ],
          'fill-extrusion-base': [
            'interpolate',
            ['linear'],
            ['zoom'],
            15,
            0,
            15.05,
            ['get', 'min_height'],
          ],
          'fill-extrusion-opacity': 0.6,
        },
      });

      mapInstance.addControl(new mapboxGl.NavigationControl());
      const popup = new mapboxGl.Popup({
        offset: 25,
        className: classes.popup,
      }).setText('я тут учился');
      new mapboxGl.Marker()
        .setLngLat(schoolLatLng)
        .setPopup(popup)
        .addTo(mapInstance);
    });

    map.current = mapInstance;
  }, []);

  return <div style={{ width: 800, height: 600 }} ref={containerRef} />;
};

export default React.memo(Map);
