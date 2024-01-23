from fastapi import FastAPI, HTTPException
import numpy as np
from pydantic import BaseModel, validator
from typing import List

import openrouteservice as ors 

app = FastAPI()

class Points(BaseModel):
    """
    Pydantic model to represent a list of points.
    Attributes:
        points (List[str]): A list of strings representing points in the format '[x, y]'.
    """
    points: List[str]
    
    @validator("points")
    def validate_points(cls, value):
        """
        Validator function to convert the list of string points to a list of integer lists.
        Args:
            cls: The class.
            value (List[str]): The list of string points.
        Returns:
            List[List[int]]: A list of integer lists representing points.
        Raises:
            ValueError: If the conversion fails.
        """
        try:
            # Convert the string coordinates to lists of integers
            return [list(map(float, point.strip('[]').split(','))) for point in value]
        except Exception as e:
            raise ValueError(f"Invalid point format: {e}")


@app.post('/shortestPath')
async def calculate_shortest_path(request : Points) -> dict[str, list[str]]:
    try:
               
        coords = request.points
        
        API=open("OpenRouteService.txt","r")
        APIKey=API.read()
        client=ors.Client(key=APIKey)
        route={}
        
        route = client.directions(
            coordinates=coords,
            profile='cycling-regular',
            format='geojson'
        )
        
        route_coordinates = route['features'][0]['geometry']['coordinates']
    
        # Convert a numpy array into the format dict[str, list[str]]
        points_as_str = [f"[{lat},{lng}]" for lat, lng in route_coordinates]
        return {"points" : points_as_str }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))



# if __name__ == "__main__":
#     import uvicorn
#     uvicorn.run(app, host="127.0.0.1", port=7777)