import { useNavigate, useParams } from "react-router";
import Container from "../components/ui/Container";
import { useConstituencyStore } from "../store/constituencyStore";
import { useCallback, useEffect, useState } from "react";
import Text from "../components/ui/Text";
import Table from "../components/ui/Table";
import ToastModal from "../components/ToastModal";
import type { TConstituencyModel } from "../types/ConstituencyType";
import DeleteModal from "../components/modals/DeleteModal";
import AddConstituencyPartModal from "../components/modals/constituency/AddConstituencyPartModal";

// Types
type WardType = { wardNumber: number };
type UnionType = { unionName: string; wards: number[] };
type UpazilaType = { upazilaName: string; unions: UnionType[] };
type CityCorporationType = { cityCorporationName: string; wards: number[] };

// Form configs
const formFieldsConfig: Record<
  string,
  {
    title: string;
    fields: { name: string; label: string; type: string; required?: boolean }[];
  }
> = {
  upazila: {
    title: "Add Upazila",
    fields: [
      {
        name: "upazilaName",
        label: "Upazila Name",
        type: "text",
        required: true,
      },
    ],
  },
  union: {
    title: "Add Union",
    fields: [
      { name: "unionName", label: "Union Name", type: "text", required: true },
    ],
  },
  ward: {
    title: "Add Ward",
    fields: [
      {
        name: "wardNumber",
        label: "Ward Number",
        type: "number",
        required: true,
      },
    ],
  },
  cityCorporation: {
    title: "Add City Corporation",
    fields: [
      {
        name: "cityCorporationName",
        label: "City Corporation Name",
        type: "text",
        required: true,
      },
    ],
  },
};

const EditConstituency: React.FC = () => {
  const navigate = useNavigate();
  const { constituencyNumber } = useParams();

  const filter = useConstituencyStore((s) => s.filter);
  const filteredDivisionObject = useConstituencyStore((s) =>
    s.getFilteredDivisionObject()
  );

  const [constituencyObjectToBeUpdate, setConstituencyObjectToBeUpdate] =
    useState<TConstituencyModel>();

  const filteredDistrictList = constituencyObjectToBeUpdate?.districts || [];

  const filteredConstituency = filteredDistrictList
    .find(
      (district) =>
        district.districtName.toLowerCase() ===
        filter.districtName.toLowerCase()
    )
    ?.constituencies.find(
      (c) => c.constituencyNumber === Number(constituencyNumber)
    );

  const [selectedUpazilaName, setSelectedUpazilaName] = useState<string>("");
  const [selectedUnionName, setSelectedUnionName] = useState<string>("");
  const [selectedCityCorporationName, setSelectedCityCorporationName] =
    useState<string>("");

  const filteredUpazila = filteredConstituency?.boundaries.upazilas?.find(
    (upazila) => upazila.upazilaName === selectedUpazilaName
  );

  const filteredUnion = filteredUpazila?.unions.find(
    (union) => union.unionName === selectedUnionName
  );

  const filteredCityCorporation =
    filteredConstituency?.boundaries.cityCorporations?.find(
      (city) => city.cityCorporationName === selectedCityCorporationName
    );

  const [toastMessage, setToastMessage] = useState<{
    type: string;
    toastMessage: string;
  }>();

  // Add Modal state
  const [addModalType, setAddModalType] = useState<
    keyof typeof formFieldsConfig | null
  >(null);

  useEffect(() => {
    if (!filteredDivisionObject) {
      navigate("/constituency-records");
    } else {
      setConstituencyObjectToBeUpdate(structuredClone(filteredDivisionObject));
    }
  }, [filteredDivisionObject, navigate]);

  // Update handlers
  const handleUpdate = useCallback(
    async (constituencyObject: TConstituencyModel | undefined) => {
      if (constituencyObject) {
        const response = await useConstituencyStore
          .getState()
          .updateConstituency(constituencyObject);

        setToastMessage(response);
      } else {
        setToastMessage({
          type: "failed",
          toastMessage: "Object is not found",
        });
      }
    },
    []
  );

  // Delete handlers
  const handleDeleteUpazila = async (name: string) => {
    if (!filteredConstituency) return;
    filteredConstituency.boundaries.upazilas =
      filteredConstituency.boundaries.upazilas?.filter(
        (upazila) => upazila.upazilaName !== name
      ) || [];
    await handleUpdate(constituencyObjectToBeUpdate);
    useConstituencyStore.getState().setFilter({ ...filter });
  };

  const handleDeleteUnion = async (name: string) => {
    if (!filteredUpazila) return;
    filteredUpazila.unions = filteredUpazila.unions.filter(
      (union) => union.unionName !== name
    );
    await handleUpdate(constituencyObjectToBeUpdate);
    useConstituencyStore.getState().setFilter({ ...filter });
  };

  const handleDeleteUnionWard = async (wardNumber: number) => {
    if (!filteredUnion) return;
    filteredUnion.wards = filteredUnion.wards.filter((w) => w !== wardNumber);
    await handleUpdate(constituencyObjectToBeUpdate);
    useConstituencyStore.getState().setFilter({ ...filter });
  };

  const handleDeleteCity = async (name: string) => {
    if (!filteredConstituency) return;
    filteredConstituency.boundaries.cityCorporations =
      filteredConstituency.boundaries.cityCorporations?.filter(
        (city) => city.cityCorporationName !== name
      ) || [];
    await handleUpdate(constituencyObjectToBeUpdate);
    useConstituencyStore.getState().setFilter({ ...filter });
  };

  const handleDeleteCityWard = async (wardNumber: number) => {
    if (!filteredCityCorporation) return;
    filteredCityCorporation.wards = filteredCityCorporation.wards.filter(
      (w) => w !== wardNumber
    );
    await handleUpdate(constituencyObjectToBeUpdate);
    useConstituencyStore.getState().setFilter({ ...filter });
  };

  // Delete modal state
  const [deleteFunction, setDeleteFunction] = useState<() => Promise<void>>();

  return (
    <Container className="relative">
      <Text size={2} className="font-semibold mb-2">
        Edit Constituency
      </Text>
      <Text size={3}>Constituency Number: {constituencyNumber}</Text>
      <Text size={4}>Division Name: {filter.divisionName}</Text>
      <Text size={4}>District Name: {filter.districtName}</Text>

      {/* Upazilas Table */}
      {filteredConstituency && (
        <div className="mt-8">
          <div className="flex justify-between items-center mb-2">
            <Text size={3} className="font-semibold">
              Upazilas
            </Text>
            <button
              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
              onClick={() => setAddModalType("upazila")}
            >
              Add Upazila
            </button>
          </div>
          <Table<UpazilaType>
            columns={[{ header: "Name", accessor: "upazilaName" }]}
            data={filteredConstituency.boundaries.upazilas || []}
            onEdit={(row) => setSelectedUpazilaName(row.upazilaName)}
            onDelete={(row) =>
              setDeleteFunction(
                () => () => handleDeleteUpazila(row.upazilaName)
              )
            }
          />
        </div>
      )}

      {/* Unions Table */}
      {filteredUpazila && (
        <div className="mt-8">
          <div className="flex justify-between items-center mb-2">
            <Text size={3} className="font-semibold">
              Unions of {filteredUpazila.upazilaName}
            </Text>
            <button
              className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
              onClick={() => setAddModalType("union")}
            >
              Add Union
            </button>
          </div>
          <Table<UnionType>
            columns={[{ header: "Name", accessor: "unionName" }]}
            data={filteredUpazila.unions}
            onEdit={(row) => setSelectedUnionName(row.unionName)}
            onDelete={(row) =>
              setDeleteFunction(() => () => handleDeleteUnion(row.unionName))
            }
          />
        </div>
      )}

      {/* Wards Table */}
      {filteredUnion && (
        <div className="mt-8">
          <div className="flex justify-between items-center mb-2">
            <Text size={3} className="font-semibold">
              Wards of {filteredUnion.unionName}
            </Text>
            <button
              className="bg-purple-500 text-white px-3 py-1 rounded hover:bg-purple-600"
              onClick={() => setAddModalType("ward")}
            >
              Add Ward
            </button>
          </div>
          <Table<WardType>
            columns={[{ header: "Ward", accessor: "wardNumber" }]}
            data={filteredUnion.wards.map((w) => ({ wardNumber: w }))}
            onDelete={(row) =>
              setDeleteFunction(
                () => () => handleDeleteUnionWard(row.wardNumber)
              )
            }
          />
        </div>
      )}

      {/* City Corporations Table */}
      {filteredConstituency && (
        <div className="mt-8">
          <div className="flex justify-between items-center mb-2">
            <Text size={3} className="font-semibold">
              City Corporations
            </Text>
            <button
              className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
              onClick={() => setAddModalType("cityCorporation")}
            >
              Add City Corporation
            </button>
          </div>
          <Table<CityCorporationType>
            columns={[{ header: "Name", accessor: "cityCorporationName" }]}
            data={filteredConstituency.boundaries.cityCorporations || []}
            onEdit={(row) =>
              setSelectedCityCorporationName(row.cityCorporationName)
            }
            onDelete={(row) =>
              setDeleteFunction(
                () => () => handleDeleteCity(row.cityCorporationName)
              )
            }
          />
        </div>
      )}

      {/* Wards Table for selected City Corporation */}
      {filteredCityCorporation && (
        <div className="mt-8">
          <div className="flex justify-between items-center mb-2">
            <Text size={3} className="font-semibold">
              Wards of {filteredCityCorporation.cityCorporationName}
            </Text>
            <button
              className="bg-pink-500 text-white px-3 py-1 rounded hover:bg-pink-600"
              onClick={() => setAddModalType("ward")}
            >
              Add Ward
            </button>
          </div>
          <Table<WardType>
            columns={[{ header: "Ward", accessor: "wardNumber" }]}
            data={filteredCityCorporation.wards.map((w) => ({ wardNumber: w }))}
            onDelete={(row) =>
              setDeleteFunction(
                () => () => handleDeleteCityWard(row.wardNumber)
              )
            }
          />
        </div>
      )}

      {/* Toast Modal */}
      <ToastModal
        type={toastMessage?.type}
        toastMessage={toastMessage?.toastMessage}
        setToastMessage={setToastMessage}
      />

      {/* Delete Modal */}
      <DeleteModal
        isOpen={!!deleteFunction}
        confirmMessage="Do you want to delete?"
        onCancel={() => setDeleteFunction(undefined)}
        onDelete={async () => {
          if (deleteFunction) {
            await deleteFunction();
            setDeleteFunction(undefined);
          }
        }}
      />

      {/* Add Item Modal */}
      <AddConstituencyPartModal
        isOpen={!!addModalType}
        setIsOpen={() => setAddModalType(null)}
        title={addModalType ? formFieldsConfig[addModalType].title : ""}
        fields={addModalType ? formFieldsConfig[addModalType].fields : []}
        onSuccess={async (data) => {
          if (!constituencyObjectToBeUpdate) return;

          // Upazila
          if (addModalType === "upazila" && filteredConstituency) {
            filteredConstituency.boundaries.upazilas =
              filteredConstituency.boundaries.upazilas || [];

            const exists = filteredConstituency.boundaries.upazilas.some(
              (upazila) =>
                upazila.upazilaName.toLowerCase() ===
                data.upazilaName.toLowerCase()
            );
            if (exists) {
              setToastMessage({
                type: "error",
                toastMessage: `Upazila "${data.upazilaName}" already exists!`,
              });
              return;
            }

            filteredConstituency.boundaries.upazilas.push({
              upazilaName: data.upazilaName,
              unions: [],
            });

            // Union
          } else if (addModalType === "union" && filteredUpazila) {
            const exists = filteredUpazila.unions.some(
              (union) =>
                union.unionName.toLowerCase() === data.unionName.toLowerCase()
            );
            if (exists) {
              setToastMessage({
                type: "error",
                toastMessage: `Union "${data.unionName}" already exists!`,
              });
              return;
            }

            filteredUpazila.unions.push({
              unionName: data.unionName,
              wards: [],
            });

            // Ward
          } else if (addModalType === "ward") {
            const wardNumber = Number(data.wardNumber);

            if (filteredUnion) {
              if (filteredUnion.wards.includes(wardNumber)) {
                setToastMessage({
                  type: "error",
                  toastMessage: `Ward "${wardNumber}" already exists!`,
                });
                return;
              }
              filteredUnion.wards.push(wardNumber);
            } else if (filteredCityCorporation) {
              if (filteredCityCorporation.wards.includes(wardNumber)) {
                setToastMessage({
                  type: "error",
                  toastMessage: `Ward "${wardNumber}" already exists!`,
                });
                return;
              }
              filteredCityCorporation.wards.push(wardNumber);
            }

            // City Corporation
          } else if (
            addModalType === "cityCorporation" &&
            filteredConstituency
          ) {
            filteredConstituency.boundaries.cityCorporations =
              filteredConstituency.boundaries.cityCorporations || [];

            const exists =
              filteredConstituency.boundaries.cityCorporations.some(
                (city) =>
                  city.cityCorporationName.toLowerCase() ===
                  data.cityCorporationName.toLowerCase()
              );
            if (exists) {
              setToastMessage({
                type: "error",
                toastMessage: `City Corporation "${data.cityCorporationName}" already exists!`,
              });
              return;
            }

            filteredConstituency.boundaries.cityCorporations.push({
              cityCorporationName: data.cityCorporationName,
              wards: [],
            });
          }

          // Update store and reset modal
          await handleUpdate(constituencyObjectToBeUpdate);
          useConstituencyStore.getState().setFilter({ ...filter });
          setAddModalType(null);
        }}
      />
    </Container>
  );
};

export default EditConstituency;
