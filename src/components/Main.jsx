import React, { useContext, useState } from "react";
import { MoreHorizontal, UserPlus, Edit2, Check } from "react-feather";
import CardAdd from "./CardAdd";
import { BoardContext } from "../context/BoardContext";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import AddList from "./AddList";
import Utils from "../utils/Utils";
import { RWebShare } from "react-web-share";

const Main = () => {
  const { allboard, setAllBoard } = useContext(BoardContext);
  const bdata = allboard.boards[allboard.active];
  const [editCard, setEditCard] = useState(null);
  const [editText, setEditText] = useState("");

  function onDragEnd(res) {
    if (!res.destination) {
      console.log("No Destination");
      return;
    }

    // Reorder lists
    if (res.type === "list") {
      const newListOrder = Array.from(bdata.list);
      const [removed] = newListOrder.splice(res.source.index, 1);
      newListOrder.splice(res.destination.index, 0, removed);

      let board_ = { ...allboard };
      board_.boards[board_.active].list = newListOrder;
      setAllBoard(board_);
      return;
    }

    const newList = [...bdata.list];
    const s_id = parseInt(res.source.droppableId);
    const d_id = parseInt(res.destination.droppableId);

    // Ensure s_id and d_id are within bounds
    if (
      s_id < 1 ||
      s_id > newList.length ||
      d_id < 1 ||
      d_id > newList.length
    ) {
      console.error("Invalid source or destination index:", s_id, d_id);
      return;
    }

    const [removed] = newList[s_id - 1].items.splice(res.source.index, 1);
    newList[d_id - 1].items.splice(res.destination.index, 0, removed);

    let board_ = { ...allboard };
    board_.boards[board_.active].list = newList;
    setAllBoard(board_);
  }

  const cardData = (e, ind) => {
    let newList = [...bdata.list];
    newList[ind].items.push({ id: Utils.makeid(5), title: e });

    let board_ = { ...allboard };
    board_.boards[board_.active].list = newList;
    setAllBoard(board_);
  };

  const listData = (e) => {
    let newList = [...bdata.list];
    newList.push({ id: newList.length + 1 + "", title: e, items: [] });

    let board_ = { ...allboard };
    board_.boards[board_.active].list = newList;
    setAllBoard(board_);
  };

  const handleEditCard = (cardId, cardTitle) => {
    setEditCard(cardId);
    setEditText(cardTitle);
  };

  const handleSaveEdit = (listIndex, cardIndex) => {
    let newList = [...bdata.list];
    newList[listIndex].items[cardIndex].title = editText;

    let board_ = { ...allboard };
    board_.boards[board_.active].list = newList;
    setAllBoard(board_);

    setEditCard(null);
    setEditText("");
  };

  if (!bdata) {
    console.error("Board data is not available");
    return <div>Error: Board data is not available</div>;
  }

  return (
    <div
      className="flex flex-col w-full"
      style={{ backgroundColor: `${bdata.bgcolor}` }}
    >
      <div className="p-3 bg-slate-300 flex justify-between w-full bg-opacity-40">
        <h2 className="text-lg">{bdata.name}</h2>
        <div className="flex items-center justify-center">
          <RWebShare
            data={{
              text: "Check out this PlanMaster!",
              url: window.location.href,
              title: `${bdata.name} + board`,
            }}
          >
            <button className="bg-gray-200 h-8 text-gray-800 px-2 py-1 mr-2 rounded flex justify-center items-center hover:bg-green-400">
              <UserPlus size={16} className="mr-2" />
              Share
            </button>
          </RWebShare>
        </div>
      </div>
      <div className="flex flex-col w-full flex-grow relative">
        <div className="absolute mb-1 pb-2 left-0 right-0 top-0 bottom-0 p-3 flex overflow-x-scroll overflow-y-hidden">
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable
              droppableId="all-lists"
              direction="horizontal"
              type="list"
            >
              {(provided) => (
                <div
                  className="flex"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {bdata.list &&
                    bdata.list.map((x, ind) => (
                      <Draggable key={x.id} draggableId={x.id} index={ind}>
                        {(provided) => (
                          <div
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            ref={provided.innerRef}
                          >
                            <div className="mr-3 w-60 h-fit rounded-md p-2 bg-slate-400 flex-shrink-0">
                              <div className="list-body">
                                <div className="flex justify-between p-1">
                                  <span>{x.title}</span>
                                </div>
                                <Droppable
                                  droppableId={x.id.toString()}
                                  type="card"
                                >
                                  {(provided, snapshot) => (
                                    <div
                                      className="py-1"
                                      ref={provided.innerRef}
                                      style={{
                                        backgroundColor: snapshot.isDraggingOver
                                          ? "#222"
                                          : "transparent",
                                      }}
                                      {...provided.droppableProps}
                                    >
                                      {x.items &&
                                        x.items.map((item, index) => (
                                          <Draggable
                                            key={item.id}
                                            draggableId={item.id}
                                            index={index}
                                          >
                                            {(provided, snapshot) => (
                                              <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                              >
                                                <div className="item flex justify-between items-center bg-zinc-300 p-1 cursor-pointer rounded-md border-2 border-zinc-900 hover:border-gray-500">
                                                  {editCard === item.id ? (
                                                    <input
                                                      type="text"
                                                      value={editText}
                                                      onChange={(e) =>
                                                        setEditText(
                                                          e.target.value
                                                        )
                                                      }
                                                      className="text-black p-1 rounded-sm w-full"
                                                    />
                                                  ) : (
                                                    <span>{item.title}</span>
                                                  )}
                                                  <span className="flex justify-start items-start">
                                                    {editCard === item.id ? (
                                                      <button
                                                        className="                                                      hover:bg-gray-600 p-1 rounded-sm"
                                                        onClick={() =>
                                                          handleSaveEdit(
                                                            ind,
                                                            index
                                                          )
                                                        }
                                                      >
                                                        <Check size={16} />
                                                      </button>
                                                    ) : (
                                                      <button
                                                        className="hover:bg-gray-600 p-1 rounded-sm"
                                                        onClick={() =>
                                                          handleEditCard(
                                                            item.id,
                                                            item.title
                                                          )
                                                        }
                                                      >
                                                        <Edit2 size={16} />
                                                      </button>
                                                    )}
                                                  </span>
                                                </div>
                                              </div>
                                            )}
                                          </Draggable>
                                        ))}
                                      {provided.placeholder}
                                    </div>
                                  )}
                                </Droppable>
                                <CardAdd getcard={(e) => cardData(e, ind)} />
                              </div>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
          <AddList getlist={(e) => listData(e)} />
        </div>
      </div>
    </div>
  );
};

export default Main;