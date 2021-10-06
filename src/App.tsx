import { useCallback, useState, Fragment, useRef } from "react";
import { Autocomplete, TextField, Grid } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { GoogleApi } from "./api";
import "./App.css";
import useDebounce from "./hooks/useDebounce";
import { Prediction } from "./types/TPrediction";
import { Place } from "./types/TPlace";

const MIN_SEARCH_LENGTH = 5;
const DEFAULT_DIRECTION = {
  number: "",
  street: "",
  sublocality: "",
  locality: "",
  state: "",
  country: "",
  code: "",
};

const types = {
  street_number: "number",
  route: "street",
  sublocality_level_1: "sublocality",
  sublocality: "sublocality",
  locality: "locality",
  administrative_area_level_1: "state",
  country: "country",
  postal_code: "code",
};

type TypesDirectionGoogle = typeof types;
type KeyDirectionGoogle = keyof TypesDirectionGoogle;

type Direction = typeof DEFAULT_DIRECTION;
type KeyType = keyof Direction;

function App() {
  const [loading, setLoading] = useState(false);
  const [direction, setDirection] = useState<Direction>(DEFAULT_DIRECTION);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Prediction>({
    place_id: "",
  } as Prediction);
  const [open, setOpen] = useState(false);
  const [place, setPlace] = useState<Place>();
  const [options, setOptions] = useState<Prediction[]>([]);

  const getDirection = useCallback((place: Place): Direction => {
    const reducedDirection = place.address_components.reduce<Direction>(
      (accum, item) => {
        const fist_type = item.types[0] as KeyDirectionGoogle;
        const type = types[fist_type];
        return { ...accum, [type]: item["long_name"] };
      },
      DEFAULT_DIRECTION
    );
    return reducedDirection;
  }, []);

  const getPredictions = useDebounce(async (search: String) => {
    setLoading(true);
    const options = await GoogleApi.getPlaces(search);
    setOptions(options);
    setLoading(false);
  }, 500);

  const getPlace = useCallback(
    async (placeId: String) => {
      const place = await GoogleApi.getPlace(placeId);
      setPlace(place);
      const direccionFormated = getDirection(place);
      setDirection(direccionFormated);
    },
    [getDirection]
  );

  const isInOptions = useCallback(
    (value: String) => {
      const isIn = options.some(
        (prediction) => prediction.description === value
      );
      return isIn;
    },
    [options]
  );

  const handleOnChagePrediction = useCallback(
    (event: React.SyntheticEvent<Element, Event>, value: Prediction | null) => {
      setSelected(value as Prediction);
      if (value) getPlace(value.place_id as String);
      if (!value) setDirection(DEFAULT_DIRECTION);
    },
    [getPlace]
  );

  const handleOnChangeText = useCallback(
    (event: React.SyntheticEvent<Element, Event>, value: string) => {
      setSearch(value);
      const searchPredictions =
        value && value.length > MIN_SEARCH_LENGTH && !isInOptions(value);
      if (searchPredictions) getPredictions(value);
    },
    [getPredictions, isInOptions]
  );

  return (
    <div className="App">
      <header className="App-header">
        <Grid sx={{ width: 300 }} container rowSpacing={1} direction="column">
          <Grid item>Some text </Grid>
          <Grid item>
            <Autocomplete
              fullWidth
              disablePortal
              value={selected}
              onChange={handleOnChagePrediction}
              loading={loading}
              open={open}
              onOpen={() => setOpen(true)}
              onClose={() => setOpen(false)}
              options={options}
              filterOptions={(options, state) => options}
              getOptionLabel={(option) => option.description || ""}
              inputValue={search}
              onInputChange={handleOnChangeText}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Dirección"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <Fragment>
                        {loading ? (
                          <CircularProgress color="inherit" size={20} />
                        ) : null}
                        {params.InputProps.endAdornment}
                      </Fragment>
                    ),
                  }}
                />
              )}
            />
          </Grid>
          <Grid item>
            <TextField fullWidth label="Calle" value={direction.street} />
          </Grid>
          <Grid item>
            <TextField fullWidth label="Numero" value={direction.number} />
          </Grid>
          <Grid item>
            <TextField
              fullWidth
              label="Colonia"
              value={direction.sublocality}
            />
          </Grid>
          <Grid item>
            <TextField fullWidth label="Municipio" value={direction.locality} />
          </Grid>
          <Grid item>
            <TextField fullWidth label="Estado" value={direction.state} />
          </Grid>
          <Grid item>
            <TextField fullWidth label="Código Postal" value={direction.code} />
          </Grid>
        </Grid>
      </header>
    </div>
  );
}

export default App;
