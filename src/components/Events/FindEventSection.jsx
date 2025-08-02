import { useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchEvents } from "../../util/http";
import LoadingIndicator from "../UI/LoadingIndicator";
import EventItem from "./EventItem";
import ErrorBlock from "../UI/ErrorBlock";
export default function FindEventSection() {
  const searchElement = useRef();
  const [searchTerm, setSearchTerm] = useState();
  const { data, isLoading, isError, error } = useQuery({
    queryFn: ({ signal }) => fetchEvents({ signal, searchTerm }),
    queryKey: ["events", { search: searchTerm }],
    enabled: searchTerm !== undefined,
  });
  function handleSubmit(event) {
    event.preventDefault();
    setSearchTerm(searchElement.current.value);
  }

  let content = <p>Please enter a search term and to find events.</p>;
  if (isLoading) {
    content = <LoadingIndicator></LoadingIndicator>;
  }
  if (isError) {
    content = (
      <ErrorBlock
        title="error occured"
        message={error.info?.message || "failed to fetch messagge"}
      ></ErrorBlock>
    );
  }
  if (data) {
    content = (
      <ul className="events-lists">
        {data.map((item) => (
          <li key={item.id}>
            <EventItem event={item}></EventItem>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <section className="content-section" id="all-events-section">
      <header>
        <h2>Find your next event!</h2>
        <form onSubmit={handleSubmit} id="search-form">
          <input
            type="search"
            placeholder="Search events"
            ref={searchElement}
          />
          <button>Search</button>
        </form>
      </header>
      {content}
    </section>
  );
}
