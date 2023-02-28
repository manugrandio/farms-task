export interface CoordinatesPayload {
  result: [
    {
      geometry: {
        location: {
          lat: number,
          lng: number,
        }
      }
    }
  ];
}

export interface DrivingDistancePayload {
  rows: [
    {
      elements: {
        distance: {
          value: number;
        }
      }
    }
  ]
}
