import Container from "../components/ui/Container";
import Flex from "../components/ui/Flex";
import { CiEdit } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import { FaAngleLeft, FaAngleRight, FaSearch } from "react-icons/fa";
import Text from "../components/ui/Text";
import { fontWeight } from "../components/utils/utils";
import { useCallback, useEffect, useRef, useState } from "react";
import type { TVoter } from "../types/VoterTypes";
import ToastModal from "../components/ToastModal";
import EditVoterModal from "../components/modals/voter/EditVoterModal";
import DeleteModal from "../components/modals/DeleteModal";
import AddVoterModal from "../components/modals/voter/AddVoterModal";
import { useVoterStore } from "../store/voterStore";
import { useConstituencyStore } from "../store/constituencyStore";

type TFilter = {
  searchText: string;
  pageNumber: number;
  divisionName?: string;
  districtName?: string;
  constituencyName?: string;
  constituencyNumber?: number;
  constituencyType?: string;
  cityCorporationName?: string;
  cityCorporationWardNumber?: number;
  upazilaName?: string;
  unionName?: string;
  unionWardNumber?: number;
};

const VoterList: React.FC = () => {
  const { divisionList, setDivisionList } = useConstituencyStore(); // 🧭 get divisions

  const {
    voterList,
    setVoterList,
    addVoter,
    updateVoter,
    deleteVoter,
    toastMessage,
  } = useVoterStore();

  const [filteredVoterList, setFilteredVoterList] = useState<TVoter[]>([]);
  const [filter, setFilter] = useState<TFilter>({
    searchText: "",
    pageNumber: 1,
  });
  const [voterObjectId, setVoterObjectId] = useState<string>("");
  const [voterToBeEdited, setVoterToBeEdited] = useState<Partial<TVoter>>();
  const [isOpenAddVoterModal, setIsOpenAddVoterModal] =
    useState<boolean>(false);

  const [localToast, setLocalToast] = useState<{
    type: string;
    toastMessage: string;
  }>();

  const tableDataStartsRef = useRef<HTMLTableElement>(null);

  const tableData = filter.searchText ? filteredVoterList : voterList;
  const totalData = tableData.length;
  const rowCount = 10;
  const pageCount = Math.ceil(totalData / rowCount);

  // 🔍 Handle search filter
  const handleSearchFilter = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFilter((state) => ({
        ...state,
        [e.target.name]: e.target.value,
      }));
    },
    []
  );

  // 🧭 Handle voter filter form change
  const handleVoterFilterChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setFilter((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  // Fetch voter list whenever filter submits
  const getVoterListUsingFilter = useCallback(async () => {
    if (
      filter.constituencyType === "upazila" &&
      filter.upazilaName &&
      filter.unionName &&
      filter.unionWardNumber
    ) {
      setVoterList({
        divisionName: filter.divisionName,
        districtName: filter.districtName,
        constituencyName: filter.constituencyName,
        constituencyNumber: Number(filter.constituencyNumber),
        upazila: {
          upazilaName: filter.upazilaName,
          unionName: filter.unionName,
          wardNumber: Number(filter.unionWardNumber),
        },
      });
    } else if (
      filter.constituencyType === "cityCorporation" &&
      filter.cityCorporationName &&
      filter.cityCorporationWardNumber
    ) {
      setVoterList({
        divisionName: filter.divisionName,
        districtName: filter.districtName,
        constituencyName: filter.constituencyName,
        constituencyNumber: Number(filter.constituencyNumber),
        cityCorporation: {
          cityCorporationName: filter.cityCorporationName,
          wardNumber: Number(filter.cityCorporationWardNumber),
        },
      });
    } else {
      // TODO: Add a toast message later
    }
  }, [
    filter.cityCorporationName,
    filter.cityCorporationWardNumber,
    filter.constituencyName,
    filter.constituencyNumber,
    filter.constituencyType,
    filter.districtName,
    filter.divisionName,
    filter.unionName,
    filter.unionWardNumber,
    filter.upazilaName,
    setVoterList,
  ]);

  // 🗑️ Handle Delete Operation
  const onDelete = useCallback(async () => {
    if (!voterObjectId) return;
    await deleteVoter(voterObjectId);
    await setVoterList(); // refresh list
    setVoterObjectId("");
  }, [voterObjectId, deleteVoter, setVoterList]);

  // 🧩 Update Voter Operation
  const updateVoterFunction = useCallback(
    async (updatedVoterData: Partial<TVoter>) => {
      if (!updatedVoterData._id) return;
      await updateVoter(updatedVoterData._id, updatedVoterData);
      // await setVoterList();
      await getVoterListUsingFilter();
      setVoterToBeEdited(undefined);
    },
    [updateVoter, getVoterListUsingFilter]
  );

  // ➕ Add Voter Operation
  const addVoterFunction = useCallback(
    async (voterFromData: Partial<TVoter>) => {
      await addVoter(voterFromData);
      setIsOpenAddVoterModal(false);
      await setVoterList();
    },
    [addVoter, setVoterList]
  );

  // 🧭 Fetch division list on mount
  useEffect(() => {
    setDivisionList();
  }, [setDivisionList]);

  // 🔍 Filter voters based on search
  useEffect(() => {
    const filterList = voterList.filter(
      (voter) =>
        voter.voterId.toLowerCase().includes(filter.searchText.toLowerCase()) ||
        voter.voterName.toLowerCase().includes(filter.searchText.toLowerCase())
    );
    setFilteredVoterList(filterList);
  }, [filter, voterList]);

  // 🧾 Sync global toast with local toast modal
  useEffect(() => {
    if (toastMessage.toastMessage) {
      setLocalToast({
        type: toastMessage.type,
        toastMessage: toastMessage.toastMessage,
      });
    }
  }, [toastMessage]);

  return (
    <Container className="relative overflow-hidden">
      {/* Header and Search */}
      <Flex className="items-end justify-between">
        <Flex className="flex-1 flex-col gap-4">
          <Text
            size={3}
            weight={fontWeight.semiBold}
            color="primary"
            className="my-4 p-2"
          >
            Voter List
          </Text>

          {/* 🧭 Voter Filter Select Fields */}
          <form className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4 border p-4 rounded-md shadow">
            {/* Division */}
            <select
              name="divisionName"
              value={filter.divisionName}
              onChange={handleVoterFilterChange}
              className="border p-2 rounded-md"
            >
              <option value="">Select Division</option>
              {divisionList.map((division) => (
                <option key={division._id} value={division.divisionName}>
                  {division.divisionName}
                </option>
              ))}
            </select>

            {/* District */}
            <select
              name="districtName"
              value={filter.districtName}
              onChange={handleVoterFilterChange}
              className="border p-2 rounded-md"
            >
              <option value="">Select District</option>
              {divisionList
                .find((d) => d.divisionName === filter.divisionName)
                ?.districts?.map((district) => (
                  <option
                    key={district.districtName}
                    value={district.districtName}
                  >
                    {district.districtName}
                  </option>
                ))}
            </select>

            {/* Constituency */}
            <select
              name="constituencyName"
              value={filter.constituencyName}
              onChange={handleVoterFilterChange}
              className="border p-2 rounded-md"
            >
              <option value="">Select Constituency</option>
              {divisionList
                .find((d) => d.divisionName === filter.divisionName)
                ?.districts?.find(
                  (dis) => dis.districtName === filter.districtName
                )
                ?.constituencies.map((consti) => (
                  <option
                    key={consti.constituencyName}
                    value={consti.constituencyName}
                  >
                    {consti.constituencyName}
                  </option>
                ))}
            </select>

            {/* Constituency Number */}
            <select
              name="constituencyNumber"
              value={filter.constituencyNumber}
              onChange={handleVoterFilterChange}
              className="border p-2 rounded-md"
            >
              <option value="">Select Constituency No.</option>
              {divisionList
                .find((d) => d.divisionName === filter.divisionName)
                ?.districts?.find(
                  (dis) => dis.districtName === filter.districtName
                )
                ?.constituencies?.map((consti) => (
                  <option
                    key={consti.constituencyNumber + "-num"}
                    value={consti.constituencyNumber}
                  >
                    {consti.constituencyNumber}
                  </option>
                ))}
            </select>

            {/* Select Constituency Type */}
            <select
              name="constituencyType"
              value={filter.constituencyType}
              onChange={handleVoterFilterChange}
              className="border p-2 rounded-md"
            >
              <option value="">Select Type</option>
              <option value="upazila">Upazila</option>
              <option value="cityCorporation">City Corporation</option>
            </select>

            {filter.constituencyType === "cityCorporation" && (
              <>
                {/* City Corporation */}
                <select
                  name="cityCorporationName"
                  value={filter.cityCorporationName}
                  onChange={handleVoterFilterChange}
                  className="border p-2 rounded-md"
                >
                  <option value="">Select City Corporation</option>
                  {divisionList
                    .find((d) => d.divisionName === filter.divisionName)
                    ?.districts?.find(
                      (dis) => dis.districtName === filter.districtName
                    )
                    ?.constituencies?.find(
                      (c) => c.constituencyName === filter.constituencyName
                    )
                    ?.boundaries.cityCorporations?.map((corp) => (
                      <option
                        key={corp.cityCorporationName}
                        value={corp.cityCorporationName}
                      >
                        {corp.cityCorporationName}
                      </option>
                    ))}
                </select>

                {/* Ward */}
                <select
                  name="cityCorporationWardNumber"
                  value={filter.cityCorporationWardNumber}
                  onChange={handleVoterFilterChange}
                  className="border p-2 rounded-md"
                >
                  <option value="">Select Ward</option>
                  {divisionList
                    .find((d) => d.divisionName === filter.divisionName)
                    ?.districts?.find(
                      (dis) => dis.districtName === filter.districtName
                    )
                    ?.constituencies?.find(
                      (c) => c.constituencyName === filter.constituencyName
                    )
                    ?.boundaries.cityCorporations?.find(
                      (cc) =>
                        cc.cityCorporationName === filter.cityCorporationName
                    )
                    ?.wards?.map((w, i) => (
                      <option key={i} value={w}>
                        {w}
                      </option>
                    ))}
                </select>
              </>
            )}

            {filter.constituencyType === "upazila" && (
              <>
                {/* Upazila */}
                <select
                  name="upazilaName"
                  value={filter.upazilaName}
                  onChange={handleVoterFilterChange}
                  className="border p-2 rounded-md"
                >
                  <option value="">Select Upazila</option>
                  {divisionList
                    .find((d) => d.divisionName === filter.divisionName)
                    ?.districts?.find(
                      (dis) => dis.districtName === filter.districtName
                    )
                    ?.constituencies?.find(
                      (c) => c.constituencyName === filter.constituencyName
                    )
                    ?.boundaries.upazilas?.map((upazila) => (
                      <option
                        key={upazila.upazilaName}
                        value={upazila.upazilaName}
                      >
                        {upazila.upazilaName}
                      </option>
                    ))}
                </select>

                {/* Union */}
                <select
                  name="unionName"
                  value={filter.unionName}
                  onChange={handleVoterFilterChange}
                  className="border p-2 rounded-md"
                >
                  <option value="">Select Union</option>
                  {divisionList
                    .find((d) => d.divisionName === filter.divisionName)
                    ?.districts?.find(
                      (dis) => dis.districtName === filter.districtName
                    )
                    ?.constituencies?.find(
                      (c) => c.constituencyName === filter.constituencyName
                    )
                    ?.boundaries.upazilas?.find(
                      (upa) => upa.upazilaName === filter.upazilaName
                    )
                    ?.unions?.map((union, i) => (
                      <option key={i} value={union.unionName}>
                        {union.unionName}
                      </option>
                    ))}
                </select>

                {/* Union Ward */}
                <select
                  name="unionWardNumber"
                  value={filter.unionWardNumber}
                  onChange={handleVoterFilterChange}
                  className="border p-2 rounded-md"
                >
                  <option value="">Select Ward</option>
                  {divisionList
                    .find((d) => d.divisionName === filter.divisionName)
                    ?.districts?.find(
                      (dis) => dis.districtName === filter.districtName
                    )
                    ?.constituencies?.find(
                      (c) => c.constituencyName === filter.constituencyName
                    )
                    ?.boundaries.upazilas?.find(
                      (upa) => upa.upazilaName === filter.upazilaName
                    )
                    ?.unions.find(
                      (union) => union.unionName === filter.unionName
                    )
                    ?.wards.map((w, i) => (
                      <option key={i} value={w}>
                        {w}
                      </option>
                    ))}
                </select>
              </>
            )}

            <button type="button" onClick={getVoterListUsingFilter}>
              Get Voter List
            </button>
          </form>

          <form className="max-w-xl w-full rounded-4xl px-4 py-2 shadow border-2 border-gray-100">
            <Flex className="gap-2 items-center">
              <FaSearch color="gray" size={20} />
              <input
                type="search"
                name="searchText"
                id="searchText"
                placeholder="Search by ID or Name"
                value={filter.searchText}
                onChange={handleSearchFilter}
                className="w-full outline-0 border-0 text-xl"
              />
            </Flex>
          </form>
        </Flex>

        <button
          onClick={() => setIsOpenAddVoterModal(true)}
          className="bg-teal-500 hover:bg-teal-700 cursor-pointer text-white px-10 py-2 rounded-md font-semibold text-xl"
        >
          Add Voter
        </button>
      </Flex>

      {/* Table */}
      <div className="text-nowrap overflow-x-auto">
        <table
          ref={tableDataStartsRef}
          className="table-auto text-left w-full rounded-md overflow-hidden mt-5"
        >
          <thead>
            <tr className="bg-gray-700 text-white">
              <th className="w-10 p-2 text-center">No.</th>
              <th className="w-52 p-2">Voter Id</th>
              <th className="p-2">Voter Name</th>
              <th className="w-32 text-center p-2">Constituency Number</th>
              <th className="w-32 text-center p-2">Constituency Name</th>
              <th className="text-center w-[100px] p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tableData
              .slice(
                (filter.pageNumber - 1) * rowCount,
                filter.pageNumber * rowCount
              )
              .map((voter, index) => (
                <tr
                  key={voter._id ?? index}
                  className="odd:bg-gray-100 even:bg-gray-200"
                >
                  <td className="p-2 text-center">{index + 1}</td>
                  <td className="p-2">{voter.voterId}</td>
                  <td className="p-2">{voter.voterName}</td>
                  <td className="w-32 text-center p-2">
                    {voter.constituency.constituencyNumber}
                  </td>
                  <td className="text-center">
                    {voter.constituency.constituencyName}
                  </td>
                  <td className="text-center p-2">
                    <Flex className="gap-3 justify-center">
                      <div
                        onClick={() => setVoterToBeEdited(voter)}
                        className="p-2 cursor-pointer bg-indigo-500 hover:bg-indigo-800 text-white rounded-3xl"
                      >
                        <CiEdit size={24} />
                      </div>
                      <div
                        onClick={() => setVoterObjectId(voter._id ?? "")}
                        className="p-2 cursor-pointer bg-rose-500 hover:bg-rose-800 text-white rounded-3xl"
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
            setFilter((s) => ({
              ...s,
              pageNumber: s.pageNumber > 1 ? s.pageNumber - 1 : s.pageNumber,
            }))
          }
        />
        <Flex className="items-center gap-2">
          {[...Array(pageCount)].map((_, i) => (
            <Text
              key={i}
              onClick={() => {
                setFilter((s) => ({ ...s, pageNumber: i + 1 }));
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
            setFilter((s) => ({
              ...s,
              pageNumber:
                s.pageNumber < pageCount ? s.pageNumber + 1 : s.pageNumber,
            }))
          }
        />
      </Flex>

      {/* ✅ Toast Modal */}
      <ToastModal
        type={localToast?.type}
        toastMessage={localToast?.toastMessage}
        setToastMessage={setLocalToast}
      />

      {/* ✅ Add Voter Modal */}
      <AddVoterModal
        isOpen={isOpenAddVoterModal}
        setIsOpen={setIsOpenAddVoterModal}
        onSuccess={addVoterFunction}
      />

      {/* ✅ Edit Voter Modal */}
      <EditVoterModal
        isOpen={!!voterToBeEdited}
        voterData={voterToBeEdited ?? {}}
        onCancel={() => setVoterToBeEdited(undefined)}
        onSuccess={updateVoterFunction}
      />

      {/* ✅ Delete Modal */}
      <DeleteModal
        isOpen={!!voterObjectId}
        onCancel={() => setVoterObjectId("")}
        onDelete={onDelete}
        confirmMessage="Want to delete this voter?"
      />
    </Container>
  );
};

export default VoterList;
