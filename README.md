# Analytics Dashboard Project

This project is an Analytics Dashboard that provides insights on top posts and active users. It displays data like:

- Top Posts of the Week
- Most Active Users of the Week
- A chart of post views

The dashboard uses Vue.js for the frontend and Express.js for the backend. It also uses MongoDB for data storage and Chart.js for visualizations.

## Features

- **Top Posts**: Displays the top posts for the past week based on views.
- **Most Active Users**: Displays the most active users based on their activity count.
- **Chart Visualizations**: Uses Chart.js to show post views over time.

## Installation

### Prerequisites

- Node.js and npm (or yarn) installed
- MongoDB instance running locally or remotely

### Getting Started

1. Clone the repository:

    ```bash
    git clone https://github.com/anatole0000/your-repository-name.git
    cd your-repository-name
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Set up environment variables (if needed):

    Create a `.env` file in the root of the project and add necessary environment variables like:

    ```bash
    DATABASE_URL=your-database-url
    SECRET_KEY=your-secret-key
    ```

4. Run the development server:

    ```bash
    npm run dev
    ```

5. Open your browser and go to `http://localhost:3000` to access the dashboard.

## Usage

- **Top Posts**: View the most viewed posts of the week.
- **Active Users**: View the users with the highest activity count for the week.
- **Chart**: Visualize the post views in a chart.

## Technologies Used

- **Frontend**: Vue.js
- **Backend**: Express.js
- **Database**: MongoDB
- **Visualization**: Chart.js

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributing

Feel free to fork the repository, open issues, or submit pull requests to contribute to this project.

## Acknowledgments

- [Vue.js](https://vuejs.org/)
- [Express.js](https://expressjs.com/)
- [Chart.js](https://www.chartjs.org/)
