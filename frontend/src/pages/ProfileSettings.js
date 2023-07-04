import React from "react";
import SidebarWithHeader from "../components/SidebarWithHeader";
import BreadCrumbBar from "../components/BreadCrumbBar";
import SessionSection from "../components/ProfileSettings/SessionSection";
import ChangePass from "../components/ProfileSettings/ChangePass";
import TwoFactor from "../components/ProfileSettings/TwoFactor";

const ProfileSettings = () => {
  return (
    <SidebarWithHeader>
      <BreadCrumbBar sections={["Profile Settings"]} />
      <TwoFactor />
      <SessionSection />
      <ChangePass />
    </SidebarWithHeader>
  );
};

export default ProfileSettings;
