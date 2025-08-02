import { Link, useNavigate, Outlet, useParams } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import Modal from "../UI/Modal.jsx";
import {
  fetchEventDetail,
  deleteEvents,
  queryClient,
} from "../../util/http.js";
import Header from "../Header.jsx";
import LoadingIndicator from "../UI/LoadingIndicator.jsx";
import ErrorBlock from "../UI/ErrorBlock.jsx";
import { useState } from "react";

export default function EventDetails() {
  const params = useParams();
  const id = params.id;
  const navigate = useNavigate();
  const [isDelete, setIsDelete] = useState(false);
  const { data, isError, isPending, error } = useQuery({
    queryKey: ["event", id],
    queryFn: ({ signal }) => fetchEventDetail({ signal, id }),
  });
  function handleDelete() {
    if (isDelete) {
      mutate({ id: id });
    }
  }
  function handleStartDelete() {
    setIsDelete(true);
  }
  function handleStopDelete() {
    setIsDelete(false);
  }

  const { mutate,isPending:isDeletePending,isError:isDeleteError,error:deleteError } = useMutation({
    mutationFn: deleteEvents,
    mutationKey: ["events-delete"],
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["events"],
        refetchType: "none",
      }),
        navigate("/events");
    },
  });
  return (
    <>
      {isDelete && (
        <Modal onClose={handleStopDelete}>
          <h2>Are you sure ?</h2>
          <p>
            Do you really want to delete this event? This action cannot be
            undone..
          </p>
          <div className="form-actions">
            {
              isDeletePending && <p>Deleting element...</p>
            }
            {!isDeletePending && <><button onClick={handleStopDelete} className="button-text">
              Cancel
            </button>
            <button onClick={handleDelete} className="button">
              Proceed
            </button></>}
            {isDeleteError && deleteError && <ErrorBlock title="An Error Occured" message={error.info?.message || "failed to delete the element "}></ErrorBlock>}
          </div>
        </Modal>
      )}
      <Outlet />
      <Header>
        <Link to="/events" className="nav-item">
          View all Events
        </Link>
      </Header>

      {isPending && (
        <div id="event-details-content" className="center">
          {" "}
          <LoadingIndicator></LoadingIndicator>
        </div>
      )}
      {isError && (
        <ErrorBlock
          title="an error occured"
          message={error.info?.message || "failed to fetch event "}
        ></ErrorBlock>
      )}
      {data && !isError && (
        <article id="event-details">
          <header>
            <h1>{data.title}</h1>
            <nav>
              <button onClick={handleStartDelete}>Delete</button>
              <Link to="edit">Edit</Link>
            </nav>
          </header>
          <div id="event-details-content">
            <img src={`http://localhost:3000/${data.image}`} alt={data.title} />
            <div id="event-details-info">
              <div>
                <p id="event-details-location">{data.location}</p>
                <br></br>
                <time dateTime={`Todo-DateT$Todo-Time`}>
                  {data.date} @ {data.time}
                </time>
              </div>
              <p id="event-details-description">{data.description}</p>
            </div>
          </div>
        </article>
      )}
    </>
  );
}
