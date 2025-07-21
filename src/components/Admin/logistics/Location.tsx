"use client";

import {
  Header4,
  HeaderAny,
  Paragraph2,
  ParagraphLink1,
} from "@/components/Text";
import React, { useState, useEffect } from "react";
import countries from "./CountriesWithFlags";
import { db } from "@/lib/firebase"; // Firestore setup
import {
  collection,
  setDoc,
  doc,
  getDocs,
  getDoc,
  deleteDoc,
} from "firebase/firestore";

interface LGA {
  id: string;
  name: string;
  shippingFee: number;
}

interface State {
  id: string;
  name: string;
  shippingFee: number;
  lgas?: LGA[]; // Add this line
}

interface Country {
  code: string;
  name: string;
  shippingFee: number;
  flag: string;
  states: State[];
}

type ShippingFeeData = {
  countryCode: string;
  shippingFee: number;
  states: State[];
};

function Locations() {
  const [openCountry, setOpenCountry] = useState(null);
  const [openAddNewState, setOpenAddNewState] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [editCountryFee, setEditCountryFee] = useState(null); // Track which country is in edit mode
  const [editStateFee, setEditStateFee] = useState(null); // Track which country is in edit mode
  const [countriesData, setCountriesData] = useState<Country[]>([]);
  const [newStateName, setNewStateName] = useState("");
  const [newStateFee, setNewStateFee] = useState<string>("");
  const [refetchKey, setRefetchKey] = useState(0); // Trigger refetch
  const [editingCountry, setEditingCountry] = useState<string | null>(null);
  const [editingState, setEditingState] = useState<string | null>(null);
  const [editingLGA, setEditingLGA] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<"all" | "active">("all");
  const [newLGAName, setNewLGAName] = useState("");
  const [newLGAFee, setNewLGAFee] = useState("");
  const [isAddingLGA, setIsAddingLGA] = useState<string | null>(null);
  const [openState, setOpenState] = useState(null);
  const [editLGAFee, setEditLGAFee] = useState(null); // Track which country is in edit mode

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const snapshot = await getDocs(collection(db, "shippingFees"));
        const fetchedData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as ShippingFeeData), // Cast doc.data() to ShippingFeeData
        }));

        const mergedCountries = countries.map((country) => {
          const matchedCountry = fetchedData.find(
            (data) => data.countryCode === country.code
          );
          return {
            ...country,
            shippingFee: matchedCountry?.shippingFee || 0,
            states: matchedCountry?.states || [],
          };
        });

        setCountriesData(mergedCountries);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchCountries();
  }, [refetchKey]); // Add refetchKey as a dependency

  const toggleStateOpen = (countryName: any) => {
    setOpenCountry((prev) => (prev === countryName ? null : countryName));
  };

  const toggleLGAOpen = (stateName: any) => {
    setOpenState((prev) => (prev === stateName ? null : stateName));
  };

  const toggleAddNewState = (countryName: any) => {
    setOpenAddNewState((prev) => (prev === countryName ? null : countryName));
  };

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const filteredCountries = countriesData
    .filter((country) => {
      if (activeFilter === "active") {
        return country.shippingFee > 0; // Filter for active countries
      }
      return true; // Show all countries
    })
    .filter((country) =>
      country.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const handleEditClick = (countryName: any) => {
    setEditCountryFee(countryName); // Set the country being edited
  };

  const handleEditStateClick = (stateName: any) => {
    setEditStateFee(stateName); // Set the country being edited
  };

  const handleEditLGAClick = (lgaName: any) => {
    setEditLGAFee(lgaName); // Set the country being edited
  };

  const handleSaveClick = async (country: Country) => {
    try {
      const countryDoc = doc(collection(db, "shippingFees"), country.code);

      await setDoc(countryDoc, {
        countryCode: country.code,
        countryName: country.name,
        shippingFee: country.shippingFee,
        states: country.states,
      });

      console.log(`Saved ${country.name} successfully!`);
      setEditingCountry(null);
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  const handleAddState = async (countryCode: string) => {
    if (!newStateName || !newStateFee) {
      alert("Please fill in all fields!");
      return;
    }

    try {
      const countryDoc = doc(collection(db, "shippingFees"), countryCode);

      const countrySnap = await getDoc(countryDoc);
      const countryData = countrySnap.data();

      if (!countryData) {
        console.error("Country data not found!");
        return;
      }

      const newState: State = {
        id: Date.now().toString(),
        name: newStateName,
        shippingFee: parseFloat(newStateFee),
      };

      const updatedStates = [...countryData.states, newState];
      await setDoc(countryDoc, { ...countryData, states: updatedStates });

      console.log(`State ${newState.name} added successfully!`);
      setNewStateName("");
      setNewStateFee("");
      setOpenAddNewState(null);
      setRefetchKey((prev) => prev + 1); // Trigger refetch
    } catch (error) {
      console.error("Error adding state:", error);
    }
  };

  const handleDeleteCountry = async (countryCode: string) => {
    try {
      await deleteDoc(doc(db, "shippingFees", countryCode));
      console.log(`Deleted country ${countryCode} successfully!`);
      setRefetchKey((prev) => prev + 1);
    } catch (error) {
      console.error("Error deleting country:", error);
    }
  };

  const handleDeleteState = async (country: Country, stateId: string) => {
    try {
      // Get the current country document
      const countryDoc = doc(db, "shippingFees", country.code);
      const countrySnap = await getDoc(countryDoc);

      if (!countrySnap.exists()) {
        console.error("Country document not found!");
        return;
      }

      // Filter out the state to be deleted
      const updatedStates = country.states.filter(
        (state) => state.id !== stateId
      );

      // Update the `states` array in Firestore
      await setDoc(countryDoc, {
        ...countrySnap.data(),
        states: updatedStates,
      });

      console.log(`Deleted state ${stateId} successfully!`);
      setRefetchKey((prev) => prev + 1); // Trigger refetch to update UI
    } catch (error) {
      console.error("Error deleting state:", error);
    }
  };

  const handleDeleteLGA = async (
    country: Country,
    stateId: string,
    lgaId: string
  ) => {
    try {
      const countryDoc = doc(db, "shippingFees", country.code);
      const countrySnap = await getDoc(countryDoc);

      if (!countrySnap.exists()) {
        console.error("Country document not found!");
        return;
      }

      const countryData = countrySnap.data() as ShippingFeeData;

      const updatedStates = countryData.states.map((state) => {
        if (state.id === stateId) {
          return {
            ...state,
            lgas: (state.lgas ?? []).filter((lga) => lga.id !== lgaId),
          };
        }
        return state;
      });

      await setDoc(countryDoc, {
        ...countryData,
        states: updatedStates,
      });

      console.log(`Deleted LGA ${lgaId} successfully!`);
      setRefetchKey((prev) => prev + 1); // Refresh UI
    } catch (error) {
      console.error("Error deleting LGA:", error);
    }
  };


  const handleAddLGA = async (countryCode: string, stateId: string) => {
    try {
      const countryDoc = doc(db, "shippingFees", countryCode);
      const countrySnap = await getDoc(countryDoc);

      if (!countrySnap.exists()) return;

      const countryData = countrySnap.data() as ShippingFeeData;

      const updatedStates = countryData.states.map((state) => {
        if (state.id === stateId) {
          const newLGA = {
            id: Date.now().toString(),
            name: newLGAName,
            shippingFee: parseFloat(newLGAFee),
          };

          return {
            ...state,
            lgas: [...(state.lgas || []), newLGA],
          };
        }
        return state;
      });

      await setDoc(countryDoc, {
        ...countryData,
        states: updatedStates,
      });

      setNewLGAName("");
      setNewLGAFee("");
      setIsAddingLGA(null);
      setRefetchKey((prev) => prev + 1); // Refresh
    } catch (error) {
      console.error("Error adding LGA:", error);
    }
  };

  return (
    <div>
      <div className="container1 pt-[100px] xl:pt-[104px] pb-[24px]">
        <div>
          <Header4>Available Shipping Locations</Header4>
        </div>
        <div className="flex justify-between items-center gap-4 mt-4">
          <div className="flex border w-full max-w-full  items-center gap-3 rounded-full px-4 py-3 bg-white text-sm sm:text-base">
            <img
              src="/icons/search.svg"
              alt="search-icon"
              className="w-5 h-5"
            />
            <input
              type="text"
              placeholder="Search for a Country"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)} // Update state on input change
              className="w-full outline-none text-gray-600 placeholder-gray-400"
            />
          </div>
          <div className="relative">
            <button onClick={toggleFilter}>
              {" "}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 13.5V3.75m0 9.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 3.75V16.5m12-3V3.75m0 9.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 3.75V16.5m-6-9V3.75m0 3.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 9.75V10.5"
                />
              </svg>
            </button>

            {isFilterOpen && (
              <div className="absolute space-y- z-10 -bottom-[120px] right-0 bg-white px-4 py-2 rounded-lg shadow-md">
                <button onClick={() => setActiveFilter("all")}>
                  <Paragraph2 className="text-sm whitespace-nowrap">
                    All Locations
                  </Paragraph2>
                </button>

                <button onClick={() => setActiveFilter("active")}>
                  <Paragraph2 className="text-sm whitespace-nowrap">
                    Active Locations
                  </Paragraph2>
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="grid xl:grid-cols-3 grid-cols-1 mt-4 gap-4">
          {filteredCountries && filteredCountries.length > 0
            ? filteredCountries.map((country: any) => (
                <div
                  className="bg-white rounded-lg relative p-2"
                  key={country.code}
                >
                  <div className="flex justify-between items-center">
                    <div
                      onClick={() => toggleStateOpen(country.name)}
                      className="flex gap-2 cursor-pointer items-center"
                    >
                      <div className="h-[50px] w-[50px] bg-bg_gray rounded-lg">
                        <img
                          src={country.flag}
                          className="h-[50px] w-[50px] rounded-lg border object-cover"
                          alt={`${country.name} flag`}
                        />
                      </div>
                      <HeaderAny className="text-[16px]">
                        {country.name}
                      </HeaderAny>
                    </div>
                    {editCountryFee === country.name ? (
                      // Edit Mode
                      <div>
                        <div className="border px-4 py-2 rounded-lg w-fit flex gap-2">
                          ₦
                          <input
                            type="text"
                            className="outline-none rounded-lg w-[50px]"
                            placeholder="0.00"
                            value={country.shippingFee}
                            onChange={(e) =>
                              setCountriesData((prev) =>
                                prev.map((c) =>
                                  c.code === country.code
                                    ? {
                                        ...c,
                                        shippingFee: parseFloat(e.target.value),
                                      }
                                    : c
                                )
                              )
                            }
                          />
                        </div>
                        <div className="flex justify-between mt-2 text-[12px] text-p_black">
                          <button
                            onClick={() => {
                              handleDeleteCountry(country.code);
                              handleEditClick(null);
                            }}
                          >
                            Delete
                          </button>
                          <button
                            onClick={() => {
                              if (editingCountry === country.code) {
                                setEditingCountry(country.code);
                              } else {
                                handleSaveClick(country);
                              }

                              handleEditClick(null);
                            }}
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    ) : (
                      // Normal View
                      <div
                        className="borde px-2 py-1 rounded-lg cursor-pointer"
                        onClick={() => handleEditClick(country.name)}
                      >
                        ₦{" "}
                        {new Intl.NumberFormat("en-US", {}).format(
                          Number(country.shippingFee)
                        )}
                      </div>
                    )}
                  </div>

                  {openCountry === country.name && (
                    <div className="absolute py-2 right-0 top-[70px] z-20 mt-2 w-full max-h-[300px] overflow-hidden overflow-y-auto scrollbar-hide px-2 rounded-lg  bg-bg_gray">
                      <Paragraph2 className=" font-bold"> States</Paragraph2>
                      <div className="   py-2">
                        {country.states.map((state: any) => (
                          <>
                            <div
                              key={state.id}
                              className="flex justify-between w-full px-2 rounded-lg bg-white  mb-2 items-center border-b py-2"
                            >
                              <div onClick={() => toggleLGAOpen(state.name)}>
                                <ParagraphLink1>{state.name}</ParagraphLink1>
                              </div>

                              {editStateFee === state.id ? (
                                // Edit Mode
                                <div>
                                  <div className="border px-4 py-1 rounded-lg w-fit flex gap-2">
                                    ₦
                                    <input
                                      type="text"
                                      className="outline-none rounded-lg w-[50px]"
                                      placeholder="0.00"
                                      value={state.shippingFee}
                                      onChange={(e) =>
                                        setCountriesData((prev) =>
                                          prev.map((c) =>
                                            c.code === country.code
                                              ? {
                                                  ...c,
                                                  states: c.states.map((s) =>
                                                    s.id === state.id
                                                      ? {
                                                          ...s,
                                                          shippingFee:
                                                            parseFloat(
                                                              e.target.value
                                                            ),
                                                        }
                                                      : s
                                                  ),
                                                }
                                              : c
                                          )
                                        )
                                      }
                                    />
                                  </div>
                                  <div className="flex justify-between mt-2 text-[12px] text-p_black">
                                    <button
                                      onClick={() => {
                                        handleDeleteState(country, state.id);
                                        handleEditStateClick(null);
                                      }}
                                    >
                                      Delete
                                    </button>
                                    <button
                                      onClick={() => {
                                        if (editingCountry === country.code) {
                                          setEditingState(state.id);
                                        } else {
                                          handleSaveClick(country);
                                        }

                                        handleEditStateClick(null);
                                      }}
                                    >
                                      Save
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                // Normal View
                                <div
                                  className="borde px-2 py-1 rounded-lg cursor-pointer"
                                  onClick={() => handleEditStateClick(state.id)}
                                >
                                  ₦{" "}
                                  {new Intl.NumberFormat("en-US", {}).format(
                                    Number(state.shippingFee)
                                  )}
                                </div>
                              )}
                            </div>
                            {openState === state.name && (
                              <div className=" bg-slate-200 mb-4 rounded-lg px-2">
                                {state.lgas?.map((lga: any) => (
                                  <div
                                    key={lga.id}
                                    className="flex justify-between py-2 border-b border-gray-500 items-center"
                                  >
                                    <ParagraphLink1>{lga.name}</ParagraphLink1>

                                    {/* <p>₦{lga.shippingFee}</p> */}

                                    {editLGAFee === lga.id ? (
                                      // Edit Mode
                                      <div>
                                        <div className="border bg-white px-4 py-1 rounded-lg w-fit flex gap-2">
                                          ₦
                                          <input
                                            type="text"
                                            className="outline-none rounded-lg w-[50px]"
                                            placeholder="0.00"
                                            value={lga.shippingFee}
                                            onChange={(e) =>
                                              setCountriesData((prev) =>
                                                prev.map((c) =>
                                                  c.code === country.code
                                                    ? {
                                                        ...c,
                                                        states: c.states.map(
                                                          (s) =>
                                                            s.id === state.id
                                                              ? {
                                                                  ...s,
                                                                  lgas: (
                                                                    s.lgas ?? []
                                                                  ).map((lg) =>
                                                                    lg.id ===
                                                                    lga.id
                                                                      ? {
                                                                          ...lg,
                                                                          shippingFee:
                                                                            parseFloat(
                                                                              e
                                                                                .target
                                                                                .value
                                                                            ),
                                                                        }
                                                                      : lg
                                                                  ),
                                                                }
                                                              : s
                                                        ),
                                                      }
                                                    : c
                                                )
                                              )
                                            }
                                          />
                                        </div>
                                        <div className="flex justify-between mt-2 text-[12px] text-p_black">
                                          <button
                                            onClick={() => {
                                              handleDeleteLGA(
                                                country,
                                                state.id,
                                                lga.id
                                              );

                                              handleEditLGAClick(null);
                                            }}
                                          >
                                            Delete
                                          </button>
                                          <button
                                            onClick={() => {
                                              if (
                                                editingCountry === country.code
                                              ) {
                                                setEditingLGA(lga.id);
                                              } else {
                                                handleSaveClick(country);
                                              }

                                              handleEditLGAClick(null);
                                            }}
                                          >
                                            Save
                                          </button>
                                        </div>
                                      </div>
                                    ) : (
                                      // Normal View
                                      <div
                                        className="borde px-2 py-1 rounded-lg cursor-pointer"
                                        onClick={() =>
                                          handleEditLGAClick(lga.id)
                                        }
                                      >
                                        ₦{" "}
                                        {new Intl.NumberFormat(
                                          "en-US",
                                          {}
                                        ).format(Number(lga.shippingFee))}
                                      </div>
                                    )}
                                  </div>
                                ))}
                                <div className=" flex flex-col gap-4 items-center w-full">
                                  {" "}
                                  {isAddingLGA !== state.id && (
                                    <button
                                      className="mt-6 mb-2 border-b px-2 py-1 border-black text-[12px] "
                                      onClick={() => setIsAddingLGA(state.id)}
                                    >
                                      Add new LGA
                                    </button>
                                  )}
                                  {isAddingLGA === state.id && (
                                    <>
                                      <div className=" my-2 w-full max-h-[300px] overflow-hidden overflow-y-auto scrollbar-hide px-4 rounded-lg  bg-white">
                                        <div className="flex justify-between items-center borde py-2">
                                          <input
                                            type="text"
                                            className="border p-2 outline-none rounded-lg w-[60%]"
                                            placeholder="Enter LGA/City name"
                                            value={newLGAName}
                                            onChange={(e) =>
                                              setNewLGAName(e.target.value)
                                            }
                                          />
                                          <div className="border px-4 py-2 rounded-lg w-fit flex gap-2">
                                            ₦{" "}
                                            <input
                                              type="text"
                                              className="outline-none rounded-lg w-[50px]"
                                              placeholder="0.00"
                                              value={newLGAFee}
                                              onChange={(e) =>
                                                setNewLGAFee(e.target.value)
                                              }
                                            />
                                          </div>
                                        </div>
                                        <button
                                          onClick={() =>
                                            handleAddLGA(country.code, state.id)
                                          }
                                          className="text-center w-full cursor-pointer text-primary py-2"
                                        >
                                          Save
                                        </button>
                                      </div>
                                    </>
                                  )}
                                </div>
                              </div>
                            )}
                          </>
                        ))}
                      </div>

                      {openAddNewState === country.code ? (
                        <div className=" mt-2 w-full max-h-[300px] overflow-hidden overflow-y-auto scrollbar-hide px-4 rounded-lg  bg-white">
                          <div className="flex justify-between items-center borde py-2">
                            <input
                              type="text"
                              className="border p-2 outline-none rounded-lg w-[60%]"
                              placeholder="Enter state name"
                              value={newStateName}
                              onChange={(e) => setNewStateName(e.target.value)}
                            />
                            <div className="border px-4 py-2 rounded-lg w-fit flex gap-2">
                              ₦{" "}
                              <input
                                type="text"
                                className="outline-none rounded-lg w-[50px]"
                                placeholder="0.00"
                                value={newStateFee}
                                onChange={(e) => setNewStateFee(e.target.value)}
                              />
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              handleAddState(country.code);
                              toggleAddNewState(country.code);
                            }}
                            className="text-center w-full cursor-pointer text-primary py-2"
                          >
                            Save
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => toggleAddNewState(country.code)}
                          className="text-center w-full cursor-pointer text-primary py-2 mt-8"
                        >
                          Add new state
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))
            : Array(20)
                .fill(null)
                .map((_, index) => (
                  <div
                    key={index}
                    className="h-[100px] w-full bg-white rounded-lg animate-pulse"
                  ></div>
                ))}
        </div>
      </div>
    </div>
  );
}

export default Locations;
