import Container from "../components/ui/Container";
import Flex from "../components/ui/Flex";
import { CiEdit } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import Text from "../components/ui/Text";
import { fontWeight } from "../components/utils/utils";
import { useCallback, useRef, useState } from "react";
import ToastModal from "../components/ToastModal";
import DeleteModal from "../components/modals/DeleteModal";
import { useNavigate } from "react-router";
import { useConstituencyStore } from "../store/constituencyStore";
import type { TFormField } from "../components/modals/constituency/AddConstituencyPartModal";
import AddConstituencyPartModal from "../components/modals/constituency/AddConstituencyPartModal";
import type { TConstituencyModel } from "../types/ConstituencyType";

const ConstituencyList: React.FC = () => {
  const navigate = useNavigate();
  const {divisionList, filter, setFilter, addDivision, updateConstituency } = useConstituencyStore();

  const tableDataStartsRef = useRef<HTMLTableElement>(null);
  const [toastMessage, setToastMessage] = useState<{
    type: string;
    toastMessage: string;
  }>();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Dynamic modal type: "division" | "district" | "constituency"
  const [modalType, setModalType] = useState<
    "division" | "district" | "constituency"
  >("constituency");

  // Delete modal state
  const [deleteFunction, setDeleteFunction] = useState<() => Promise<void>>();

  // Form fields for modal
  const divisionFields: TFormField[] = [
    {
      name: "divisionName",
      label: "Division Name",
      type: "text",
      required: true,
    },
  ];

  const districtFields: TFormField[] = [
    {
      name: "districtName",
      label: "District Name",
      type: "text",
      required: true,
    },
  ];

  const constituencyFields: TFormField[] = [
    {
      name: "constituencyNumber",
      label: "Constituency Number",
      type: "number",
      required: true,
    },
    {
      name: "constituencyName",
      label: "Constituency Name",
      type: "text",
      required: true,
    },
  ];

  // Handle filter changes
  const handleFilter = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setFilter({
        ...filter,
        [e.target.name]: e.target.value,
        pageNumber: 1,
      });
    },
    [filter, setFilter]
  );

  const filteredDivisionObject = useConstituencyStore((s) =>
    s.getFilteredDivisionObject()
  );

  const filteredDistrictList = filteredDivisionObject?.districts || [];

  const filteredConstituencyList =
    filteredDistrictList.find(
      (district) =>
        district.districtName.toLowerCase() ===
        filter.districtName.toLowerCase()
    )?.constituencies || [];

  const tableData = filteredConstituencyList;
  const totalData: number = tableData.length;
  const rowCount: number = 10;
  const pageCount: number = Math.ceil(totalData / rowCount);

  /** ----------------- MODAL HANDLERS ----------------- **/

  const handleAddDivision = async (data: Record<string, string>) => {
    const divisionName = data.divisionName?.trim();
    if (!divisionName) return;

    const toast = await addDivision(divisionName);
    setToastMessage(toast);
  };

  const handleAddDistrict = async (data: Record<string, string>) => {
    const divisionName = filter.divisionName;
    const districtName = data.districtName?.trim();

    if (!divisionName) {
      setToastMessage({
        type: "error",
        toastMessage: "Please select a division first.",
      });
      return;
    }

    if (!districtName) return;

    const division = divisionList.find((d) => d.divisionName === divisionName);
    if (!division) {
      setToastMessage({
        type: "error",
        toastMessage: "Selected division does not exist.",
      });
      return;
    }

    const districtExists = division.districts.some(
      (d) => d.districtName.toLowerCase() === districtName.toLowerCase()
    );

    if (districtExists) {
      setToastMessage({
        type: "error",
        toastMessage: `District "${districtName}" already exists in ${divisionName}.`,
      });
      return;
    }

    const updatedDivision: TConstituencyModel = {
      ...division,
      districts: [...division.districts, { districtName, constituencies: [] }],
    };

    const toast = await updateConstituency(updatedDivision);
    setToastMessage(toast);
  };

  const handleAddConstituency = async (data: Record<string, string>) => {
    if (!filter.divisionName || !filter.districtName) {
      setToastMessage({
        type: "error",
        toastMessage: "Please select division and district first.",
      });
      return;
    }

    const newConstituencyNumber = Number(data.constituencyNumber);
    const division = divisionList.find(
      (d) => d.divisionName === filter.divisionName
    );
    if (!division) return;

    const district = division.districts.find(
      (dist) => dist.districtName === filter.districtName
    );
    if (!district) return;

    // Check if constituency already exists
    const exists = district.constituencies.some(
      (c) => c.constituencyNumber === newConstituencyNumber
    );
    if (exists) {
      setToastMessage({
        type: "error",
        toastMessage: `Constituency number ${newConstituencyNumber} already exists!`,
      });
      return;
    }

    const updatedDistrict = {
      ...district,
      constituencies: [
        ...district.constituencies,
        {
          constituencyNumber: newConstituencyNumber,
          constituencyName: data.constituencyName,
          boundaries: { upazilas: [], cityCorporations: [] },
        },
      ],
    };

    const updatedDivision: TConstituencyModel = {
      ...division,
      districts: division.districts.map((dist) =>
        dist.districtName === district.districtName ? updatedDistrict : dist
      ),
    };

    const toast = await updateConstituency(updatedDivision);
    setToastMessage(toast);
  };

  const handleDeleteConstituency = async (constituencyNumber: number) => {
    const division = divisionList.find(
      (d) => d.divisionName === filter.divisionName
    );
    if (!division) return;

    const district = division.districts.find(
      (dist) => dist.districtName === filter.districtName
    );
    if (!district) return;

    const constituencyToDelete = district.constituencies.find(
      (c) => c.constituencyNumber === constituencyNumber
    );
    if (!constituencyToDelete) return;

    // Check if constituency has boundaries
    if (
      (constituencyToDelete.boundaries.upazilas?.length || 0) > 0 ||
      (constituencyToDelete.boundaries.cityCorporations?.length || 0) > 0
    ) {
      setToastMessage({
        type: "error",
        toastMessage:
          "Cannot delete constituency with existing upazilas or city corporations.",
      });
      return;
    }

    const updatedDistrict = {
      ...district,
      constituencies: district.constituencies.filter(
        (c) => c.constituencyNumber !== constituencyNumber
      ),
    };

    const updatedDivision: TConstituencyModel = {
      ...division,
      districts: division.districts.map((dist) =>
        dist.districtName === district.districtName ? updatedDistrict : dist
      ),
    };

    const toast = await updateConstituency(updatedDivision);
    setToastMessage(toast);
    setFilter({ ...filter });
  };

  return (
    <Container className="relative overflow-hidden">
      <Flex className="items-end justify-between">
        <Flex className="flex-1 flex-col gap-4">
          <Text
            size={3}
            weight={fontWeight.semiBold}
            color="primary"
            className="my-4 p-2"
          >
            Constituency List
          </Text>

          <form className="max-w-xl w-full">
            {/* Division Select */}
            <Flex className="w-full">
              <label className="flex-1" htmlFor="divisionName">
                Select Division
              </label>
              <select
                name="divisionName"
                id="divisionName"
                value={filter.divisionName}
                onChange={handleFilter}
                className="flex-1 max-w-[200px] p-2 rounded-xs border border-black"
              >
                <option value="">--</option>
                {divisionList.map((division, index) => (
                  <option
                    key={division.divisionName + index}
                    value={division.divisionName}
                  >
                    {division.divisionName}
                  </option>
                ))}
              </select>
            </Flex>

            {/* District Select */}
            <Flex className="w-full">
              <label className="flex-1" htmlFor="districtName">
                Select District
              </label>
              <select
                name="districtName"
                id="districtName"
                value={filter.districtName}
                onChange={handleFilter}
                className="flex-1 max-w-[200px] p-2 rounded-xs border border-black"
              >
                <option value="">--</option>
                {filteredDistrictList.map((district, index) => (
                  <option
                    key={district.districtName + index}
                    value={district.districtName}
                  >
                    {district.districtName}
                  </option>
                ))}
              </select>
            </Flex>
          </form>
        </Flex>

        <Flex className="shrink gap-3">
          <button
            onClick={() => {
              setModalType("constituency");
              setIsModalOpen(true);
            }}
            disabled={!filter.divisionName || !filter.districtName} // disabled if either is missing
            className={`px-10 py-2 rounded-md font-semibold text-xl text-white ${
              !filter.divisionName || !filter.districtName
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-teal-500 hover:bg-teal-700"
            }`}
          >
            Add Constituency
          </button>

          <button
            onClick={() => {
              setModalType("division");
              setIsModalOpen(true);
            }}
            className="bg-indigo-500 hover:bg-indigo-700 text-white px-10 py-2 rounded-md font-semibold text-xl"
          >
            Add Division
          </button>

          <button
            onClick={() => {
              setModalType("district");
              setIsModalOpen(true);
            }}
            disabled={!filter.divisionName}
            className={`px-10 py-2 rounded-md font-semibold text-xl text-white ${
              !filter.divisionName
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-orange-500 hover:bg-orange-700"
            }`}
          >
            Add District
          </button>
        </Flex>
      </Flex>

      {/* Table */}
      <div className="text-nowrap overflow-x-auto">
        <table
          ref={tableDataStartsRef}
          className="table-auto text-left w-full rounded-md overflow-hidden mt-5"
        >
          <thead>
            <tr className="bg-gray-700 text-white">
              <th className="w-10 p-2 text-center">Sl No.</th>
              <th className="w-8 p-2 text-center">Constituency Number</th>
              <th className="w-8 p-2 text-center">Constituency Name</th>
              <th className="p-2 text-center">Upazilas or City Corporations</th>
              <th className="w-[100px] text-center p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tableData
              .slice(
                (filter.pageNumber - 1) * rowCount,
                filter.pageNumber * rowCount
              )
              .map((constituency, index) => (
                <tr key={index} className="odd:bg-gray-100 even:bg-gray-200">
                  <td className="p-2 text-center">{index + 1}</td>
                  <td className="p-2 text-center">
                    {constituency.constituencyNumber}
                  </td>
                  <td className="p-2 text-center">
                    {constituency.constituencyName}
                  </td>
                  <td className="p-2 text-center flex flex-wrap items-center justify-center">
                    {constituency.boundaries.cityCorporations?.map(
                      (city, idx) => (
                        <span key={city.cityCorporationName + idx}>
                          {city.cityCorporationName}
                        </span>
                      )
                    )}
                    {constituency.boundaries.upazilas?.map((upazila, idx) => (
                      <span key={upazila.upazilaName + idx}>
                        {upazila.upazilaName}
                      </span>
                    ))}
                  </td>
                  <td className="text-center p-2">
                    <Flex className="gap-3 justify-center">
                      <div
                        onClick={() =>
                          navigate(`${constituency.constituencyNumber}`)
                        }
                        className="p-2 cursor-pointer bg-indigo-500 hover:bg-indigo-800 text-white rounded-3xl"
                      >
                        <CiEdit size={24} />
                      </div>
                      <div
                        className="p-2 cursor-pointer bg-rose-500 hover:bg-rose-800 text-white rounded-3xl"
                        onClick={() =>
                          setDeleteFunction(
                            () => () =>
                              handleDeleteConstituency(
                                constituency.constituencyNumber
                              )
                          )
                        }
                      >
                        <MdDelete size={24} />
                      </div>
                    </Flex>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <Flex className="items-center gap-4 justify-end mt-3">
        <Text size={6}>Pages</Text>
        <FaAngleLeft
          cursor="pointer"
          size={20}
          onClick={() =>
            setFilter({
              ...filter,
              pageNumber: Math.max(filter.pageNumber - 1, 1),
            })
          }
        />
        <Flex className="items-center gap-2">
          {[...Array(pageCount)].map((_, i) => (
            <Text
              key={i}
              onClick={() => {
                setFilter({ ...filter, pageNumber: i + 1 });
                if (tableDataStartsRef.current) {
                  const y =
                    tableDataStartsRef.current.getBoundingClientRect().top +
                    window.scrollY -
                    200;
                  window.scrollTo({ top: y, behavior: "smooth" });
                }
              }}
              weight={fontWeight.semiBold}
              className={`px-2 py-1 cursor-pointer ${
                filter.pageNumber === i + 1
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              } rounded-md`}
            >
              {i + 1}
            </Text>
          ))}
        </Flex>
        <FaAngleRight
          cursor="pointer"
          size={20}
          onClick={() =>
            setFilter({
              ...filter,
              pageNumber: Math.min(filter.pageNumber + 1, pageCount),
            })
          }
        />
      </Flex>

      {/* Toast Modal */}
      <ToastModal
        type={toastMessage?.type}
        toastMessage={toastMessage?.toastMessage}
        setToastMessage={setToastMessage}
      />

      {/* Dynamic Modal for Division/District/Constituency */}
      <AddConstituencyPartModal
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        title={
          modalType === "division"
            ? "Add Division"
            : modalType === "district"
            ? "Add District"
            : "Add Constituency"
        }
        fields={
          modalType === "division"
            ? divisionFields
            : modalType === "district"
            ? districtFields
            : constituencyFields
        }
        onSuccess={
          modalType === "division"
            ? handleAddDivision
            : modalType === "district"
            ? handleAddDistrict
            : handleAddConstituency
        }
      />

      {/* Delete Modal */}
      <DeleteModal
        isOpen={!!deleteFunction}
        confirmMessage="Do you want to delete this constituency?"
        onCancel={() => setDeleteFunction(undefined)}
        onDelete={async () => {
          if (deleteFunction) {
            await deleteFunction();
            setDeleteFunction(undefined);
          }
        }}
      />
    </Container>
  );
};

export default ConstituencyList;
