/** Format the coordinates to exchange with the openrouteservice API */

// Convert coordinates from strings to numbers
export function parseCoordinates(coordinates) {
    return coordinates.map(coordinate => {
        const [lng, lat] = coordinate.replace('[', '').replace(']', '').split(',');
        return [parseFloat(lng), parseFloat(lat)];
    });
}

// Convert coordinates to strings 
export function formatCoordinates(coordinates) {
    return coordinates.map(coord => `[${coord[0]},${coord[1]}]`);
}


/** functions to find similarities between routes */

// Find the longest common subsequence between two lists
function longestCommonSubsequence(list1, list2) {
    // Get the lengths of the lists
    const m = list1.length;
    const n = list2.length;
    // Create a 2D array to store the lengths of the longest common subsequences
    const dp = Array.from(Array(m + 1), () => Array(n + 1).fill(0));

    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (list1[i - 1].toString() === list2[j - 1].toString()) {
                dp[i][j] = dp[i - 1][j - 1] + 1;
            } else {
                dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
            }
        }
    }

    const lcs = [];
    let i = m, j = n;
    // Reconstruct the longest common subsequence from the 2D array
    while (i > 0 && j > 0) {
        if (list1[i - 1].toString() === list2[j - 1].toString()) {
            lcs.unshift(list1[i - 1]);
            i--;
            j--;
        } else if (dp[i - 1][j] > dp[i][j - 1]) {
            i--;
        } else {
            j--;
        }
    }
    // Return the longest common subsequence
    return lcs;
}

// Compare two routes and determine the similarity
function compareRoutes(route1, route2) {
    // Parse the coordinates from the routes
    const coords1 = parseCoordinates(route1.route);
    const coords2 = parseCoordinates(route2.route);
    // Find the longest common subsequence between the coordinates
    const lcs = longestCommonSubsequence(coords1, coords2);
    // Calculate the similarity between the routes
    const similarity = lcs.length / Math.min(coords1.length, coords2.length);
    // Return the longest common subsequence and the similarity
    return { lcs, similarity };
}

// Compare the user route with all relevant routes
export async function compareUserRouteWithRelevantRoutes(userRoute, relevantRoutes, similarityThreshold = 0.5) {
    const similarities = [];
    // Go through all relevant routes
    for (const relevantRoute of relevantRoutes) {
        // Compare the user route with the relevant route
        const { lcs, similarity } = compareRoutes(userRoute, relevantRoute);
        // If the similarity is above the threshold, add it to the list
        if (similarity > similarityThreshold) {
            similarities.push({ route: relevantRoute, similarity, lcs });
        }
    }
    return similarities;
}


