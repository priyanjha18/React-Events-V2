import { Link, useNavigate, useParams } from "react-router-dom";
import { useQuery,useMutation, } from "@tanstack/react-query";
import { editEvents, fetchEventDetail, queryClient } from "../../util/http.js";

import Modal from "../UI/Modal.jsx";
import EventForm from "./EventForm.jsx";
import LoadingIndicator from "../UI/LoadingIndicator.jsx";
import ErrorBlock from "../UI/ErrorBlock.jsx";

export default function EditEvent() {
  const params = useParams();
  const id = params.id;
  const { data, isPending, isError, error } = useQuery({
    queryFn: ({ signal }) => fetchEventDetail({ signal, id }),
    queryKey: ["event",  id],
  });
  const {mutate}=useMutation({
    mutationFn:editEvents,
    onMutate:async (data)=>{
      await queryClient.cancelQueries({queryKey:["event",  id]})
      const prevData=queryClient.getQueryData(["event",id])
      queryClient.setQueryData(["event",  id],data.event)
      return {prevData}
      
    },
    onError:(error,data,context)=>{
      queryClient.setQueryData(["event",id],context.prevData)

    },
    onSettled:()=>{
      queryClient.invalidateQueries({queryKey:["event",id]})
    }
  })
  const navigate = useNavigate();

  function handleSubmit(formData) {
    mutate({id:id,event:formData})
    navigate("../")

  } 

  function handleClose() {
    navigate("../");
  }

  return (
    <Modal onClose={handleClose}>
      {isPending && (
        <div className="center">
          <LoadingIndicator></LoadingIndicator>
        </div>
      )}
      {isError && error && (
        <>
          <ErrorBlock
            title="an error occured"
            message={error.info?.message || "unable to fetch event detail"}
          ></ErrorBlock>
          <Link to="/events"><button className="button">Ok</button></Link>
        </>
      )}
      {!isPending && data && (
        <EventForm inputData={data} onSubmit={handleSubmit}>
          <Link to="../" className="button-text">
            Cancel
          </Link>
          <button type="submit" className="button">
            Update
          </button>
        </EventForm>
      )}
    </Modal>
  );
}
