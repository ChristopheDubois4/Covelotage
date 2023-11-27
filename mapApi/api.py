from fastapi import FastAPI, HTTPException
from numba import jit
import numpy as np
from pydantic import BaseModel, validator
from typing import List

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
            return [list(map(int, point.strip('[]').split(','))) for point in value]
        except Exception as e:
            raise ValueError(f"Invalid point format: {e}")


@jit(nopython=True)
def test(points):
    new_point = np.array([[42, 666]])
    pts = np.append(points, new_point, axis = 0)
    return pts


@app.post('/shortestPath')
async def calculate_shortest_path(request : Points) -> dict[str, list[str]]:
    try:
        # Convert the list into a numpy array to process faster
        points_np = np.array(request.points)
        
        # PROCESS THE DATAS
        # Exemple
        points = test(points_np)   
             
        # Convert a numpy array into the format dict[str, list[str]]
        points_as_str = [f"[{x},{y}]" for x, y in points]
        return {"points" : points_as_str }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))



# if __name__ == "__main__":
#     import uvicorn
#     uvicorn.run(app, host="127.0.0.1", port=7777)