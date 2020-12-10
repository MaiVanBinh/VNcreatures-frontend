import React, { useState, useEffect, useCallback } from "react";
import { connect } from "react-redux";
import { withRouter, Redirect } from "react-router-dom";
import "../../components/SearchCreatures/SearchResult/SearchResult.css";
import "./Admin.css";
import { getQuery } from "../../store/utilities/updateObject";
import FormSearch from "../../components/SearchCreatures/SearchResult/FormFilter/FormFilter";
import Panigation from "../../components/Panigation/Panigation";
import TableAdminvV1 from "../../components/UI/TableAdminvV1/TableAdminvV1";

import * as actions from "../../store/actions/index";

const TABLE_CONFIG = {
  id: 'Id',
  name_vn: 'Tên tiếng việt',
  name_latin: 'Tên Latin',
  species_vn: 'Loài',
  group_vn: 'Lớp',
  order_vn: 'Bộ',
  family_vn: 'Họ',
  created_at: 'Ngày tạo',
  created_by: 'Sửa'
}
const SearchResult = (props) => {
  const [formInput, setFormInput] = useState({
    species: 0,
    group: [],
    order: [],
    family: [],
    name: "",
  });

  const [formOption, setFormOption] = useState(null);

  const [pageInput, setPageInput] = useState(1);
  const { onFetchFilterData, filterData, onFetchCreatures, token } = props;
  useEffect(() => {
    onFetchFilterData();
    onFetchCreatures();
  }, [onFetchFilterData, onFetchCreatures]);

  const initFormOption = useCallback(() => {
    let formInputUpdate = {
      species: {
        label: "Loài",
        options: [
          {
            id: "0",
            name_vn: "Tất cả",
          },
          ...props.filterData.species,
        ],
      },
      group: {
        label: "Nhóm",
        options: [...props.filterData.groups],
      },
      order: {
        label: "Bộ",
        options: [...props.filterData.orders],
      },
      family: {
        label: "Họ",
        options: [...props.filterData.families],
      },
    };
    setFormOption(formInputUpdate);
  }, [props.filterData]);

  useEffect(() => {
    if (filterData) {
      initFormOption();
    }
  }, [initFormOption, filterData]);

  useEffect(() => {
    props.history.push({
      search: "",
    });
  }, [props.history]);

  const onChangePageInput = (event) => {
    const pageInputUpdate = event.target.value.replace(/[^0-9]/g, "");
    setPageInput(pageInputUpdate);
  };

  const changeInput = (event) => {
    const formInputUpdate = formInput;
    let formOptionUpdate = { ...formOption };
    const target = event.target;
    const value = target.value;
    const name = target.name;
    console.log("change1");
    if (name === "species") {
      console.log("change");
      formInputUpdate.species = parseInt(value);
      formInputUpdate.group = [];
      formInputUpdate.order = [];
      formInputUpdate.family = [];
      formOptionUpdate = updateOptionFollowInput(formInputUpdate);
    } else if (name === "creatureName") {
      formInputUpdate.name = value;
    } else {
      let checked = target.checked;
      if (checked) {
        formInputUpdate[name].push(parseInt(value));
      } else {
        let updateOpt = [...formInputUpdate[name]];
        const valueIndex = updateOpt.indexOf(parseInt(value));
        updateOpt.splice(valueIndex, 1);
        formInputUpdate[name] = [...updateOpt];
        if (name === "group") {
          formInputUpdate.order = [];
          formInputUpdate.family = [];
        }
        if (name === "order") {
          formInputUpdate.family = [];
        }
      }
      formOptionUpdate = updateOptionFollowInput(formInputUpdate);
    }
    setFormOption(formOptionUpdate);
    setFormInput({ ...formInputUpdate });
  };

  const onResetFormInput = () => {
    setFormInput({
      species: 0,
      group: [],
      order: [],
      family: [],
      name: "",
    });
    if (props.filterData) {
      initFormOption();
    }
  };

  const updateOptionFollowInput = (formInputUpdate) => {
    let groupUpdateOption;
    if (formInputUpdate.species > 0) {
      groupUpdateOption = props.filterData.group.filter(
        (g) => parseInt(g.species) === formInputUpdate.species
      );
    } else {
      groupUpdateOption = [...props.filterData.group];
    }

    let orderUpdateOption;
    if (formInputUpdate.group.length === 0) {
      const setGroupId = groupUpdateOption.map((g) => g.id);
      orderUpdateOption = props.filterData.order.filter((o) => {
        return setGroupId.findIndex((gId) => gId === o.group) > -1;
      });
    } else {
      orderUpdateOption = props.filterData.order.filter((o) => {
        return (
          formInputUpdate.group.findIndex((gId) => gId === parseInt(o.group)) >
          -1
        );
      });
    }

    let familyUpdateOption;
    if (formInputUpdate.order.length === 0) {
      const setOrderId = orderUpdateOption.map((g) => g.id);
      familyUpdateOption = props.filterData.family.filter((f) => {
        return setOrderId.findIndex((oId) => oId === f.order) > -1;
      });
    } else {
      familyUpdateOption = props.filterData.family.filter((f) => {
        return (
          formInputUpdate.order.findIndex((oId) => oId === parseInt(f.order)) >
          -1
        );
      });
    }
    const updateOption = { ...formOption };
    return {
      ...updateOption,
      group: { ...updateOption.group, options: [...groupUpdateOption] },
      order: { ...updateOption.order, options: [...orderUpdateOption] },
      family: { ...updateOption.family, options: [...familyUpdateOption] },
    };
  };

  const fetchCreaturesHandler = () => {
    let queryString = getQuery({ ...formInput, page: 1 });
    props.onFetchCreatures(queryString);
    props.history.push({
      search: queryString,
    });
  };

  const onFetchCreaturesByPage = (page) => {
    let queryString = getQuery({ ...formInput, page: page });
    props.onFetchCreatures(queryString);
    props.history.push({
      search: queryString,
    });
  };

  return (
    <section className="cd-gallery">
      { token ? null : <Redirect to="/" />}
      {props.creatures ? <TableAdminvV1
        tableConfig={TABLE_CONFIG}
        data={props.creatures}
        // onViewDetail={onViewDetailHandler}
        // onEdit={editHandler}
        // createClick={createNewPost}
        // deleteClick={deletePost}
        // fetchData={onFetchDataByPage}
        numberPage={props.numberOfPages}
      /> : null}
      
      
    </section>
  );
};

const mapStateToProps = (state) => {
  return {
    page: state.creatures.page,
    filterData: state.creatures.filterData,
    filterDataLoading: state.creatures.loading,
    loadFilterDataErr: state.creatures.error,
    creatures: state.creatures.creatures,
    numberOfPages: state.creatures.numberOfPages,
    token: state.auth.token
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onFetchCreatures: (queryArray) => {
      dispatch(actions.fetchCreatures(queryArray));
    },
    onFetchFilterData: () => {
      dispatch(actions.fetchFilterData());
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(SearchResult));
