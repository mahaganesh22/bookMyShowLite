function Panel() {
    return (
        <section className="panel">
            <div className="panel1">
                <a className = "movies" href="/movies">Movies</a>
                <a className = "stream" href="/movies">Stream</a>
                <a className = "events" href="/movies">Events</a>
                <a className = "plays" href="/movies">Plays</a>
                <a className = "sports" href="/movies">Sports</a>
                <a className = "activities" href="/movies">Activities</a>
            </div>

            <div className="panel2">
                <a className = "listyourshow" href="/movies">ListYourShow</a>
                <a className = "corporates" href="/movies">Corporates</a>
                <a className = "offers" href="/movies">Offers</a>
                <a className = "giftcards" href="/movies">Gift Cards</a>
            </div>
        </section>
    )
}

export default Panel