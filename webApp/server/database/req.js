
import RouteModel from '../model/Route.model.js';

const periodicDateRef = new Date(1970, 0, 1);

export async function getRevelentsRoutes(req) {
    try {
        // Get the username from the token
        const username = req.user.username;
        // Get the route details from the request body
        const { planning } = req.body;
        // Extract dates and periodic details
        const { dates: user_dates, periodic: user_periodic } = planning;

        // Time difference to search for matches (in minutes)
        const dt = 10;
        // Number of days to search for matches
        const nbDays = 30;

        /** Conditions for specific dates */

        // Condition between user_dates and dates
        let dateConditions = [];
        // Condition between user_periodic and dates
        let datePeriodicConditions = [];
        // Verify if the user has specific dates
        if (user_dates.length > 0) {

            /** Condition between user_dates and dates */
            dateConditions = user_dates.map(date => {
                // Convert the date string to a date object
                let dateObj = new Date(date);
                // Set the start date
                let startDate = new Date(dateObj);
                startDate.setMinutes(startDate.getMinutes() - dt);
                // Set the end daterevelentsRoutes
                let endDate = new Date(dateObj);
                endDate.setMinutes(endDate.getMinutes() + dt);
                // Return the date range condition
                return {
                    'planning.dates': {
                        $elemMatch: {
                            $gte: startDate,
                            $lte: endDate
                        }
                    }
                };
            });

            /** Condition between user_periodic and dates */
            datePeriodicConditions = user_dates.map(date => {
                // Convert the date string to a date object
                let dateObj = new Date(date);
                // Get the day of the week
                const dayOfWeek = dateObj.getDay();
                // Set the start date
                let startDate = new Date(periodicDateRef);
                startDate.setHours(dateObj.getHours());
                startDate.setMinutes(dateObj.getMinutes() - dt);
                // Set the end date
                let endDate = new Date(periodicDateRef);
                endDate.setHours(dateObj.getHours());
                endDate.setMinutes(dateObj.getMinutes() + dt);
                // Return the date range condition
                return {
                    'planning.periodic': {
                        $elemMatch: {
                            dayOfWeek: dayOfWeek,
                            time: {
                                $gte: startDate,
                                $lte: endDate
                            }
                        }
                    }
                };
            });
        } else {
            console.log("No date conditions");
        }   

        /** Conditions for periodic times */

        // Condition between user_periodic and periodic
        let periodicConditions = [];
        // Condition between user_periodic and dates
        let periodicDateConditions = [];
        // Verify if the user has periodic times
        if (user_periodic.length > 0) {

            /** Condition between user_periodic and periodic */

            periodicConditions = user_periodic.map(periodic => {
                // Get the day of the week 
                let dayOfWeek = periodic.dayOfWeek;
                // Get the time 
                let time = periodic.time;
                // Set the start date
                let startDate = new Date(time);
                startDate.setMinutes(startDate.getMinutes() - dt);
                // Set the end date
                let endDate = new Date(time);
                endDate.setMinutes(endDate.getMinutes() + dt);
                // Return the periodic range condition 
                return {
                    'planning.periodic': {
                        $elemMatch: {
                            dayOfWeek: dayOfWeek,
                            time: {
                                $gte: startDate,
                                $lte: endDate
                            }
                        }
                    }
                };
            });

            /** Condition between user_periodic and dates */

            // Generate the dates for the next 30 days from user_periodic
            let futureDates = user_periodic.flatMap(periodic => {
                // Create an array of 30 dates
                return Array.from({length: nbDays}, (_, i) => {
                    // Create a date object for each day
                    let date = new Date();
                    // Set the date to the current date + i days
                    date.setDate(date.getDate() + i);
                    // Check if the day of the week matches the periodic day
                    if (date.getDay() === periodic.dayOfWeek) {
                        // Set the time to the periodic time
                        let time = new Date(periodic.time);
                        // Set the hours and minutes
                        date.setHours(time.getHours(), time.getMinutes(), 0, 0);
                        // Return the date
                        return date;
                    }
                    // Return null if the day of the week does not match
                    return null;
                })
                // Filter out the null values
                .filter(date => date !== null);
            });

            // Generate conditions for each future date
            periodicDateConditions = futureDates.map(date => {
                // Set the start date 
                let startDate = new Date(date);
                startDate.setMinutes(startDate.getMinutes() - dt);
                // Set the end date
                let endDate = new Date(date);
                endDate.setMinutes(endDate.getMinutes() + dt);
                // Return the date range condition
                return {
                    'planning.dates': {
                        $gte: startDate,
                        $lte: endDate
                    }
                };
            });           
        } else {
            console.log("No periodic conditions");
        }
      
        
        const relevantRoutes = await RouteModel.find({
            // Exclude the current user's routes
            username: { $ne: username },
            // Combine all the conditions
            // $or: [
            //     ...dateConditions,
            //     ...periodicConditions,
            //     ...periodicDateConditions,
            //     ...datePeriodicConditions
            // ]
        });

        return Promise.resolve(relevantRoutes);
    } catch (error) {
        return Promise.reject(error);
    }
}
