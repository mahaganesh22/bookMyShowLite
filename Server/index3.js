import express from "express"
import cors from "cors"
import pg from "pg"
import bodyParser from 'body-parser'

async function groupTagsByName() {
    const client = new pg.Client({
        user: 'postgres',
        host: 'localhost',
        database: 'bookMyShowLite',
        password: 'Ramarao@456',
        port: 5432,
    });

    try {
        await client.connect();

        // SQL query to group tags by name directly in database
        const query = `
            SELECT 
                m.name,
                ARRAY_AGG(DISTINCT mt.tag) as tags
            FROM movies m
            JOIN movie_tags mt ON m.id = mt.movie_id
            GROUP BY m.name
            ORDER BY m.name;
        `;

        const result = await client.query(query);
        
        // Convert to object format for easy access
        const groupedTags = {};
        result.rows.forEach(row => {
            groupedTags[row.name] = row.tags;
        });

        return groupedTags;

    } catch (error) {
        console.error('Error grouping tags:', error);
        throw error;
    } finally {
        await client.end();
    }
}

// Usage example
async function main() {
    const movieTags = await groupTagsByName();
    console.log(movieTags);
}

main().catch(console.error);

module.exports = { groupTagsByName };