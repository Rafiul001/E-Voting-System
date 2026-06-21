import { IoMdClose } from "react-icons/io";
import Flex from "../../ui/Flex";
import Text from "../../ui/Text";
import type {
  TVoter,
  TVoterBase,
  TVoterConstituency,
} from "../../../types/VoterTypes";
import { useEffect, useState } from "react";
import { useConstituencyStore } from "../../../store/constituencyStore";

type TEditVoterModal = {
  isOpen: boolean;
  voterData: Partial<TVoter>;
  onSuccess: (formData: Partial<TVoter>) => void;
  onCancel: () => void;
};

const EditVoterModal: React.FC<TEditVoterModal> = ({
  isOpen,
  voterData,
  onSuccess,
  onCancel,
}) => {
  const [formData, setFormData] = useState<Partial<TVoter>>({});
  const { divisionList } = useConstituencyStore();

  useEffect(() => {
    if (isOpen && voterData) setFormData(voterData);
    else if (!isOpen) setFormData({});
  }, [isOpen, voterData]);

  const onChangeFormData = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    const nameParts = name.split(".");

    if (nameParts.includes("voterName")) {
      setFormData((state) => ({
        ...state,
        voterName: value,
      }));
    }

    if (
      nameParts.includes("constituency") &&
      nameParts.includes("divisionName")
    ) {
      setFormData((state) => ({
        ...state,
        constituency: state.constituency
          ? { ...state.constituency, divisionName: value }
          : undefined, // or keep it empty if not yet initialized
      }));
    }

    if (
      nameParts.includes("constituency") &&
      nameParts.includes("districtName")
    ) {
      setFormData((state) => ({
        ...state,
        constituency: state.constituency
          ? { ...state.constituency, districtName: value }
          : undefined, // or keep it empty if not yet initialized
      }));
    }

    if (
      nameParts.includes("constituency") &&
      nameParts.includes("constituencyNumber")
    ) {
      setFormData((state) => ({
        ...state,
        constituency: state.constituency
          ? { ...state.constituency, constituencyNumber: Number(value) }
          : undefined, // or keep it empty if not yet initialized
      }));
    }

    if (
      nameParts.includes("constituency") &&
      nameParts.includes("constituencyName")
    ) {
      setFormData((state) => ({
        ...state,
        constituency: state.constituency
          ? { ...state.constituency, constituencyName: value }
          : undefined, // or keep it empty if not yet initialized
      }));
    }

    if (
      nameParts.includes("cityCorporation") &&
      nameParts.includes("cityCorporationName")
    ) {
      setFormData((state) => ({
        ...state,
        constituency: state.constituency
          ? "cityCorporation" in state.constituency
            ? {
                ...state.constituency,
                cityCorporation: {
                  ...state.constituency.cityCorporation,
                  cityCorporationName: value,
                },
              }
            : {
                ...state.constituency,
                cityCorporation: undefined,
              }
          : undefined,
      }));
    }

    if (
      nameParts.includes("cityCorporation") &&
      nameParts.includes("wardNumber")
    ) {
      setFormData((state) => ({
        ...state,
        constituency: state.constituency
          ? "cityCorporation" in state.constituency
            ? {
                ...state.constituency,
                cityCorporation: {
                  ...state.constituency.cityCorporation,
                  wardNumber: Number(value),
                },
              }
            : {
                ...state.constituency,
                cityCorporation: undefined,
              }
          : undefined,
      }));
    }

    if (nameParts.includes("upazila") && nameParts.includes("upazilaName")) {
      setFormData((state) => ({
        ...state,
        constituency: state.constituency
          ? "upazila" in state.constituency
            ? {
                ...state.constituency,
                upazila: {
                  ...state.constituency.upazila,
                  upazilaName: value,
                },
              }
            : {
                ...state.constituency,
                upazila: undefined,
              }
          : undefined,
      }));
    }

    if (nameParts.includes("upazila") && nameParts.includes("unionName")) {
      setFormData((state) => ({
        ...state,
        constituency: state.constituency
          ? "upazila" in state.constituency
            ? {
                ...state.constituency,
                upazila: {
                  ...state.constituency.upazila,
                  unionName: value,
                },
              }
            : {
                ...state.constituency,
                upazila: undefined,
              }
          : undefined,
      }));
    }

    if (nameParts.includes("upazila") && nameParts.includes("wardNumber")) {
      setFormData((state) => ({
        ...state,
        constituency: state.constituency
          ? "upazila" in state.constituency
            ? {
                ...state.constituency,
                upazila: {
                  ...state.constituency.upazila,
                  wardNumber: Number(value),
                },
              }
            : {
                ...state.constituency,
                upazila: undefined,
              }
          : undefined,
      }));
    }

    if (
      nameParts.includes("constituency") &&
      nameParts.includes("homeAddress")
    ) {
      setFormData((state) => ({
        ...state,
        constituency: state.constituency
          ? {
              ...state.constituency,
              homeAddress: value,
            }
          : undefined,
      }));
    }
  };

  // Dependent dropdowns
  const selectedDivision = divisionList.find(
    (d) => d.divisionName === formData.constituency?.divisionName
  );
  const selectedDistrict = selectedDivision?.districts.find(
    (dist) => dist.districtName === formData.constituency?.districtName
  );
  const selectedConstituency = selectedDistrict?.constituencies.find(
    (c) => c.constituencyNumber === formData.constituency?.constituencyNumber
  );

  // Type guards
  const isUpazila = (
    constituency: TVoterConstituency
  ): constituency is TVoterBase & {
    upazila: { upazilaName: string; unionName: string; wardNumber: number };
  } => {
    return "upazila" in constituency && constituency.upazila !== undefined;
  };

  const isCityCorporation = (
    constituency: TVoterConstituency
  ): constituency is TVoterBase & {
    cityCorporation: { cityCorporationName: string; wardNumber: number };
  } => {
    return (
      "cityCorporation" in constituency &&
      constituency.cityCorporation !== undefined
    );
  };

  return (
    <div className="relative">
      {/* Overlay */}
      <div
        onClick={onCancel}
        className={`fixed inset-0 bg-gray-500/30 z-40 transition-opacity duration-300 ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      ></div>

      {/* Modal */}
      <div
        className={`fixed z-50 top-1/2 left-1/2 w-full max-h-full overflow-auto max-w-[600px] p-4 bg-gray-50 rounded-2xl shadow transition-all duration-300 transform ${
          isOpen
            ? "opacity-100 scale-100 -translate-x-1/2 -translate-y-1/2"
            : "opacity-0 scale-95 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        }`}
      >
        <Flex className="items-center justify-between border-b-2 border-gray-200">
          <Text size={4} className="py-4 font-semibold">
            Edit Voter
          </Text>
          <div
            onClick={onCancel}
            className="p-1 text-white bg-rose-500 cursor-pointer hover:bg-rose-600 rounded-md transition-all"
          >
            <IoMdClose size={24} />
          </div>
        </Flex>

        <form className="py-2 flex flex-col gap-4">
          {/* Voter Name */}
          <Flex className="flex-col gap-2">
            <label htmlFor="voterName">
              <Text size={5} className="font-semibold">
                Voter Name
              </Text>
            </label>
            <input
              type="text"
              name="voterName"
              id="voterName"
              value={formData.voterName ?? ""}
              placeholder="Enter Voter Name"
              onChange={onChangeFormData}
              className="border-[2px] border-indigo-300 focus:outline-indigo-500 px-2 py-1 rounded-md font-medium"
            />
          </Flex>

          {/* Division */}
          <Flex className="flex-col gap-2">
            <label>Division</label>
            <select
              name="constituency.divisionName"
              value={formData.constituency?.divisionName ?? ""}
              onChange={onChangeFormData}
              className="border-[2px] border-indigo-300 px-2 py-1 rounded-md"
            >
              <option value="">Select Division</option>
              {divisionList.map((d) => (
                <option key={d.divisionName} value={d.divisionName}>
                  {d.divisionName}
                </option>
              ))}
            </select>
          </Flex>

          {/* District */}
          {selectedDivision && (
            <Flex className="flex-col gap-2">
              <label>District</label>
              <select
                name="constituency.districtName"
                value={formData.constituency?.districtName ?? ""}
                onChange={onChangeFormData}
                className="border-[2px] border-indigo-300 px-2 py-1 rounded-md"
              >
                <option value="">Select District</option>
                {selectedDivision.districts.map((dist) => (
                  <option key={dist.districtName} value={dist.districtName}>
                    {dist.districtName}
                  </option>
                ))}
              </select>
            </Flex>
          )}

          {/* Constituency */}
          {selectedDistrict && (
            <Flex className="flex-col gap-2">
              <label>Constituency</label>
              <select
                name="constituency.constituencyNumber"
                value={formData.constituency?.constituencyNumber ?? ""}
                onChange={onChangeFormData}
                className="border-[2px] border-indigo-300 px-2 py-1 rounded-md"
              >
                <option value="">Select Constituency</option>
                {selectedDistrict.constituencies.map((c) => (
                  <option
                    key={c.constituencyNumber}
                    value={c.constituencyNumber}
                  >
                    {c.constituencyNumber} - {c.constituencyName}
                  </option>
                ))}
              </select>
            </Flex>
          )}

          {/* Upazila or City Corporation */}
          {selectedConstituency && (
            <Flex className="flex-col gap-2">
              <label>Upazila / City Corporation</label>
              <select
                name="constituencyType"
                value={
                  formData.constituency
                    ? "upazila" in formData.constituency
                      ? "upazila"
                      : "cityCorporation" in formData.constituency
                      ? "cityCorporation"
                      : ""
                    : ""
                }
                onChange={(e) => {
                  const value = e.target.value;
                  if (!formData.constituency) return;
                  const base: TVoterBase = {
                    divisionName: formData.constituency.divisionName,
                    districtName: formData.constituency.districtName,
                    constituencyNumber:
                      formData.constituency.constituencyNumber,
                    constituencyName: formData.constituency.constituencyName,
                    homeAddress: formData.constituency.homeAddress,
                  };

                  if (value === "upazila") {
                    setFormData((prev) => ({
                      ...prev,
                      constituency: {
                        ...base,
                        upazila: {
                          upazilaName: "",
                          unionName: "",
                          wardNumber: 1,
                        },
                      },
                    }));
                  } else if (value === "cityCorporation") {
                    setFormData((prev) => ({
                      ...prev,
                      constituency: {
                        ...base,
                        cityCorporation: {
                          cityCorporationName: "",
                          wardNumber: 1,
                        },
                      },
                    }));
                  }
                }}
                className="border-[2px] border-indigo-300 px-2 py-1 rounded-md"
              >
                <option value="">Select Type</option>
                {selectedConstituency.boundaries.upazilas && (
                  <option value="upazila">Upazila</option>
                )}
                {selectedConstituency.boundaries.cityCorporations && (
                  <option value="cityCorporation">City Corporation</option>
                )}
              </select>
            </Flex>
          )}

          {/* Upazila Fields */}
          {formData.constituency &&
            isUpazila(formData.constituency) &&
            selectedConstituency?.boundaries.upazilas && (
              <>
                {/* Upazila */}
                <Flex className="flex-col gap-2">
                  <label>Upazila</label>
                  <select
                    name="upazila.upazilaName"
                    value={formData.constituency.upazila.upazilaName}
                    onChange={onChangeFormData}
                    className="border-[2px] border-indigo-300 px-2 py-1 rounded-md"
                  >
                    <option value="">Select Upazila</option>
                    {selectedConstituency.boundaries.upazilas.map((u) => (
                      <option key={u.upazilaName} value={u.upazilaName}>
                        {u.upazilaName}
                      </option>
                    ))}
                  </select>
                </Flex>

                {/* Union */}
                {formData.constituency.upazila.upazilaName && (
                  <Flex className="flex-col gap-2">
                    <label>Union</label>
                    <select
                      name="upazila.unionName"
                      value={formData.constituency.upazila.unionName}
                      onChange={onChangeFormData}
                      className="border-[2px] border-indigo-300 px-2 py-1 rounded-md"
                    >
                      <option value="">Select Union</option>
                      {selectedConstituency.boundaries.upazilas
                        .find(
                          (u) =>
                            u.upazilaName ===
                            (formData.constituency &&
                            isUpazila(formData.constituency)
                              ? formData.constituency.upazila.upazilaName
                              : "")
                        )
                        ?.unions.map((un) => (
                          <option key={un.unionName} value={un.unionName}>
                            {un.unionName}
                          </option>
                        ))}
                    </select>
                  </Flex>
                )}

                {/* Ward Number */}
                {formData.constituency.upazila.unionName && (
                  <Flex className="flex-col gap-2">
                    <label>Ward Number</label>
                    <select
                      name="upazila.wardNumber"
                      value={formData.constituency.upazila.wardNumber}
                      onChange={onChangeFormData}
                      className="border-[2px] border-indigo-300 px-2 py-1 rounded-md"
                    >
                      <option value="">Select Ward</option>
                      {selectedConstituency.boundaries.upazilas
                        .find(
                          (u) =>
                            u.upazilaName ===
                            (formData.constituency &&
                            isUpazila(formData.constituency)
                              ? formData.constituency.upazila.upazilaName
                              : "")
                        )
                        ?.unions.find(
                          (un) =>
                            un.unionName ===
                            (formData.constituency &&
                              isUpazila(formData.constituency) &&
                              formData.constituency.upazila.unionName)
                        )
                        ?.wards.map((w) => (
                          <option key={w} value={w}>
                            {w}
                          </option>
                        ))}
                    </select>
                  </Flex>
                )}
              </>
            )}

          {/* City Corporation Fields */}
          {formData.constituency &&
            isCityCorporation(formData.constituency) &&
            selectedConstituency?.boundaries.cityCorporations && (
              <>
                <Flex className="flex-col gap-2">
                  <label>City Corporation</label>
                  <select
                    name="cityCorporation.cityCorporationName"
                    value={
                      formData.constituency.cityCorporation.cityCorporationName
                    }
                    onChange={onChangeFormData}
                    className="border-[2px] border-indigo-300 px-2 py-1 rounded-md"
                  >
                    <option value="">Select City Corporation</option>
                    {selectedConstituency.boundaries.cityCorporations.map(
                      (c) => (
                        <option
                          key={c.cityCorporationName}
                          value={c.cityCorporationName}
                        >
                          {c.cityCorporationName}
                        </option>
                      )
                    )}
                  </select>
                </Flex>

                <Flex className="flex-col gap-2">
                  <label>Ward Number</label>
                  <select
                    name="cityCorporation.wardNumber"
                    value={formData.constituency.cityCorporation.wardNumber}
                    onChange={onChangeFormData}
                    className="border-[2px] border-indigo-300 px-2 py-1 rounded-md"
                  >
                    <option value="">Select Ward</option>
                    {selectedConstituency.boundaries.cityCorporations
                      .find(
                        (c) =>
                          c.cityCorporationName ===
                          (formData.constituency &&
                          isCityCorporation(formData.constituency)
                            ? formData.constituency.cityCorporation
                                .cityCorporationName
                            : "")
                      )
                      ?.wards.map((w) => (
                        <option key={w} value={w}>
                          {w}
                        </option>
                      ))}
                  </select>
                </Flex>
              </>
            )}

          {/* Voter Home Address */}
          <Flex className="flex-col gap-2">
            <label htmlFor="dateOfBirth">
              <Text size={5} className="font-semibold">
                Date of Birth
              </Text>
            </label>
            <input
              type="date"
              name="dateOfBirth"
              id="dateOfBirth"
              value={formData.dateOfBirth ?? ""}
              onChange={onChangeFormData}
              className="border-[2px] border-indigo-300 focus:outline-indigo-500 px-2 py-1 rounded-md font-medium"
            />
          </Flex>

          {/* Voter Home Address */}
          <Flex className="flex-col gap-2">
            <label htmlFor="homeAddress">
              <Text size={5} className="font-semibold">
                Home Address
              </Text>
            </label>
            <input
              type="text"
              name="constituency.homeAddress"
              id="constituency.homeAddress"
              value={formData.constituency?.homeAddress ?? ""}
              placeholder="Enter Home Address"
              onChange={onChangeFormData}
              className="border-[2px] border-indigo-300 focus:outline-indigo-500 px-2 py-1 rounded-md font-medium"
            />
          </Flex>

          {/* Buttons */}
          <Flex className="gap-2 justify-end">
            <button
              type="button"
              onClick={onCancel}
              className="text-white px-4 py-1 bg-rose-500 hover:bg-rose-600 rounded-sm"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() =>
                onSuccess(formData)
              }
              className="text-white px-4 py-1 bg-teal-500 hover:bg-teal-600 rounded-sm"
            >
              Update
            </button>
          </Flex>
        </form>
      </div>
    </div>
  );
};

export default EditVoterModal;
