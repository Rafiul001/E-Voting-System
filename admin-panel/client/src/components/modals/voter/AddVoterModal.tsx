import { IoMdClose } from "react-icons/io";
import Flex from "../../ui/Flex";
import Text from "../../ui/Text";
import type { TVoter } from "../../../types/VoterTypes";
import { useEffect, useState } from "react";
import { useConstituencyStore } from "../../../store/constituencyStore";

type TVoterFormData = {
  voterId: string;
  voterName: string;
  dateOfBirth: string;
  divisionName: string;
  districtName: string;
  constituencyNumber: number;
  constituencyName: string;
  constituencyType: string;
  upazilaName: string;
  unionName: string;
  unionWardNumber: number;
  cityCorporationName: string;
  cityCorporationWardNumber: number;
  homeAddress: string;
};

const DEFAULT_VALUE = {
  voterId: "",
  voterName: "",
  dateOfBirth: "",
  divisionName: "",
  districtName: "",
  constituencyNumber: 0,
  constituencyName: "",
  constituencyType: "",
  upazilaName: "",
  unionName: "",
  unionWardNumber: 0,
  cityCorporationName: "",
  cityCorporationWardNumber: 0,
  homeAddress: "",
};

type TAddVoterModal = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSuccess: (formData: Partial<TVoter>) => void;
};

const AddVoterModal: React.FC<TAddVoterModal> = ({
  isOpen,
  setIsOpen,
  onSuccess,
}) => {
  const [formData, setFormData] = useState<TVoterFormData>(DEFAULT_VALUE);
  const [inputError, setInputError] = useState<Record<string, boolean>>({});
  const { divisionList } = useConstituencyStore();

  const onChangeFormData = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((state) => ({ ...state, [name]: value }));
    setInputError((error) => ({ ...error, [name]: false }));
  };

  const selectedDivision = divisionList.find(
    (d) => d.divisionName === formData.divisionName
  );

  const selectedDistrict = selectedDivision?.districts.find(
    (dist) => dist.districtName === formData.districtName
  );
  const selectedConstituency = selectedDistrict?.constituencies.find(
    (c) => c.constituencyNumber === Number(formData.constituencyNumber)
  );

  const handleCancel = () => {
    setFormData(DEFAULT_VALUE);
    setIsOpen(false);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const errors: Record<string, boolean> = {};

    Array.from(form.elements).forEach((el) => {
      if (el instanceof HTMLInputElement || el instanceof HTMLSelectElement) {
        const name = el.name;
        const value = el.value;

        if (!value) {
          errors[name] = true;
        }
      }
    });

    if (Object.entries(errors).length > 0) {
      setInputError(errors);
    } else {
      const constituencyName = selectedConstituency?.constituencyName ?? "";
      let newVoter: Partial<TVoter>;

      if (formData.constituencyType === "upazila") {
        newVoter = {
          voterId: formData.voterId,
          voterName: formData.voterName,
          dateOfBirth: formData.dateOfBirth,
          constituency: {
            constituencyNumber: Number(formData.constituencyNumber),
            constituencyName: constituencyName,
            districtName: formData.districtName,
            divisionName: formData.divisionName,
            homeAddress: formData.homeAddress,
            upazila: {
              upazilaName: formData.upazilaName,
              unionName: formData.unionName,
              wardNumber: Number(formData.unionWardNumber),
            },
          },
        };
      } else {
        newVoter = {
          voterId: formData.voterId,
          voterName: formData.voterName,
          dateOfBirth: formData.dateOfBirth,
          constituency: {
            constituencyNumber: Number(formData.constituencyNumber),
            constituencyName: constituencyName,
            districtName: formData.districtName,
            divisionName: formData.divisionName,
            homeAddress: formData.homeAddress,
            cityCorporation: {
              cityCorporationName: formData.cityCorporationName,
              wardNumber: Number(formData.cityCorporationWardNumber),
            },
          },
        };
      }
      onSuccess(newVoter);
      setInputError({});
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setFormData(DEFAULT_VALUE);
      setInputError({});
    }
  }, [isOpen]);

  return (
    <div className="relative">
      {/* Overlay */}
      <div
        onClick={handleCancel}
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
            Add Voter
          </Text>
          <div
            onClick={handleCancel}
            className="p-1 text-white bg-rose-500 cursor-pointer hover:bg-rose-600 rounded-md transition-all"
          >
            <IoMdClose size={24} />
          </div>
        </Flex>

        {/* Form */}
        <form onSubmit={handleSubmit} className="py-2 flex flex-col gap-4">
          {/* Voter Id */}
          <Flex className="flex-col gap-2">
            <label htmlFor="voterId">
              <Text size={5} className="font-semibold">
                Voter Id
              </Text>
            </label>
            <input
              type="text"
              name="voterId"
              value={formData.voterId ?? ""}
              placeholder="Enter Voter Id"
              onChange={onChangeFormData}
              className={`border-[2px] ${
                inputError.voterId ? "border-red-500" : "border-indigo-300"
              } focus:outline-indigo-500 px-2 py-1 rounded-md font-medium`}
            />
          </Flex>

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
              className={`border-[2px] ${
                inputError.voterName ? "border-red-500" : "border-indigo-300"
              } focus:outline-indigo-500 px-2 py-1 rounded-md font-medium`}
            />
          </Flex>

          {/* Division */}
          <Flex className="flex-col gap-2">
            <label>Division</label>
            <select
              name="divisionName"
              value={formData.divisionName}
              onChange={onChangeFormData}
              className={`border-[2px] ${
                inputError.divisionName ? "border-red-500" : "border-indigo-300"
              } px-2 py-1 rounded-md`}
            >
              <option value="">Select Division</option>
              {divisionList.map((d) => (
                <option key={d.divisionName} value={d.divisionName}>
                  {d.divisionName}
                </option>
              ))}
            </select>
          </Flex>

          {/* District Name */}
          {selectedDivision && (
            <Flex className="flex-col gap-2">
              <label>District Name</label>
              <select
                name="districtName"
                value={formData.districtName}
                onChange={onChangeFormData}
                className={`border-[2px] ${
                  inputError.districtName
                    ? "border-red-500"
                    : "border-indigo-300"
                } px-2 py-1 rounded-md`}
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
                name="constituencyNumber"
                value={formData.constituencyNumber}
                onChange={onChangeFormData}
                className={`border-[2px] ${
                  inputError.constituencyNumber
                    ? "border-red-500"
                    : "border-indigo-300"
                } px-2 py-1 rounded-md`}
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
                value={formData.constituencyType}
                onChange={onChangeFormData}
                className={`border-[2px] ${
                  inputError.cityCorporationType
                    ? "border-red-500"
                    : "border-indigo-300"
                } px-2 py-1 rounded-md`}
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
          {formData.constituencyType === "upazila" &&
            selectedConstituency?.boundaries.upazilas &&
            selectedConstituency.boundaries.upazilas.length > 0 && (
              <>
                {/* Upazila */}
                <Flex className="flex-col gap-2">
                  <label>Upazila</label>
                  <select
                    name="upazilaName"
                    value={formData.upazilaName}
                    onChange={onChangeFormData}
                    className={`border-[2px] ${
                      inputError.upazilaName
                        ? "border-red-500"
                        : "border-indigo-300"
                    } px-2 py-1 rounded-md`}
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
                {formData.upazilaName && (
                  <Flex className="flex-col gap-2">
                    <label>Union</label>
                    <select
                      name="unionName"
                      value={formData.unionName}
                      onChange={onChangeFormData}
                      className={`border-[2px] ${
                        inputError.unionName
                          ? "border-red-500"
                          : "border-indigo-300"
                      } px-2 py-1 rounded-md`}
                    >
                      <option value="">Select Union</option>
                      {selectedConstituency.boundaries.upazilas
                        .find((u) => u.upazilaName === formData.upazilaName)
                        ?.unions.map((un) => (
                          <option key={un.unionName} value={un.unionName}>
                            {un.unionName}
                          </option>
                        ))}
                    </select>
                  </Flex>
                )}

                {/* Union Ward Number */}
                {formData.unionName && (
                  <Flex className="flex-col gap-2">
                    <label>Union Ward Number</label>
                    <select
                      name="unionWardNumber"
                      value={formData.unionWardNumber}
                      onChange={onChangeFormData}
                      className={`border-[2px] ${
                        inputError.unionWardNumber
                          ? "border-red-500"
                          : "border-indigo-300"
                      } px-2 py-1 rounded-md`}
                    >
                      <option value="">Select Ward</option>
                      {selectedConstituency.boundaries.upazilas
                        .find((u) => u.upazilaName === formData.upazilaName)
                        ?.unions.find(
                          (un) => un.unionName === formData.unionName
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
          {formData.constituencyType === "cityCorporation" &&
            selectedConstituency?.boundaries.cityCorporations &&
            selectedConstituency.boundaries.cityCorporations.length > 0 && (
              <>
                <Flex className="flex-col gap-2">
                  <label>City Corporation</label>
                  <select
                    name="cityCorporationName"
                    value={formData.cityCorporationName}
                    onChange={onChangeFormData}
                    className={`border-[2px] ${
                      inputError.cityCorporationName
                        ? "border-red-500"
                        : "border-indigo-300"
                    } px-2 py-1 rounded-md`}
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

                {formData.cityCorporationName && (
                  <Flex className="flex-col gap-2">
                    <label>City Corporation Ward Number</label>
                    <select
                      name="cityCorporationWardNumber"
                      value={formData.cityCorporationWardNumber}
                      onChange={onChangeFormData}
                      className={`border-[2px] ${
                        inputError.cityCorporationWardNumber
                          ? "border-red-500"
                          : "border-indigo-300"
                      } px-2 py-1 rounded-md`}
                    >
                      <option value="">Select Ward</option>
                      {selectedConstituency.boundaries.cityCorporations
                        .find(
                          (c) =>
                            c.cityCorporationName ===
                            formData.cityCorporationName
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
              className={`border-[2px] ${
                inputError.dateOfBirth ? "border-red-500" : "border-indigo-300"
              } px-2 py-1 rounded-md`}
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
              name="homeAddress"
              id="homeAddress"
              value={formData.homeAddress ?? ""}
              placeholder="Enter Home Address"
              onChange={onChangeFormData}
              className={`border-[2px] ${
                inputError.homeAddress ? "border-red-500" : "border-indigo-300"
              } px-2 py-1 rounded-md`}
            />
          </Flex>

          {/* Buttons */}
          <Flex className="gap-2 justify-end">
            <button
              type="button"
              onClick={handleCancel}
              className="text-white px-4 py-1 bg-rose-500 hover:bg-rose-600 rounded-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="text-white px-4 py-1 bg-teal-500 hover:bg-teal-600 rounded-sm"
            >
              Add
            </button>
          </Flex>
        </form>
      </div>
    </div>
  );
};

export default AddVoterModal;
