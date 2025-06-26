import { PingSignal } from "@components/PingSignal";
import { useBillingState } from "@features/billing";
import { isBillingEnabled } from "@features/env";
import { ThemeToggle } from "@features/theme";
import { Menu, Transition } from "@headlessui/react";
import { IconCreditCard, IconDoorExit } from "@tabler/icons-react";
import { useQueryClient } from "@tanstack/react-query";
import React, { Fragment, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";
import { signOut, updateEmail, UserAccount, UserAvatar } from "../auth";

type Props = {
  user: UserAccount;
};

const Divider = () => <div className="border-t my-1" />;

const MenuItem = (props: {
  href: string;
  onClick?: () => Promise<void> | void;
  reloadDocument?: boolean;
  children: React.ReactNode;
}) => (
  <Menu.Item>
    {({ active }) => (
      <Link
        to={props.href}
        onClick={props.onClick}
        reloadDocument={props.reloadDocument}
        className={twMerge(
          "flex mx-1 rounded p-2 text-sm items-center space-x-2",
          active ? "bg-accent text-foreground" : ""
        )}
      >
        {props.children}
      </Link>
    )}
  </Menu.Item>
);

export function UserMenu(props: Props) {
  const billing = useBillingState();
  const queryClient = useQueryClient();
  const [editEmail, setEditEmail] = useState(false);
  const [email, setEmail] = useState<string>(props.user.email);

  const handleEmail = async () => {
    if (email === props.user.email) {
      toast.error("Email is already set to your current email");
      return;
    }
    if (typeof email !== "string" || email.length === 0) return;
    try {
      const updatedUser = await updateEmail(email);
      setEditEmail(false);
      toast.success("Email updated");
      if (updatedUser) {
        queryClient.setQueryData(["me"], updatedUser);
      }
    } catch (err: any) {
      console.error(err.message);
      toast.error("Failed to update email");
      setEmail(props.user.email);
    }
  };

  const toggleEdit = () => setEditEmail((prev) => !prev);

  return (
    <Menu as="div" className="relative">
      <Menu.Button className="flex w-full p-2 gap-2 items-center rounded text-sm focus-ring hover:bg-accent">
        {({ open }) => (
          <>
            <UserAvatar user={props.user} />
            <div className="hidden lg:block">{props.user.name}</div>
            {!open && billing === "OVERUSE" && <PingSignal color="warning" size="sm" />}
          </>
        )}
      </Menu.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 lg:bottom-8 lg:right-auto z-10 mt-2 w-60 origin-top-right rounded-md py-1 shadow-lg border bg-background focus-ring">
          <div className="px-3 py-1 text-xs flex flex-col gap-y-2">
            <div className="flex flex-col gap-y-1">
              <span className="text-muted-foreground">Signed in as</span>
              {editEmail ? (
                <input
                  className="border p-1 rounded-sm outline"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                />
              ) : (
                <span className="block truncate text-sm font-medium">{props.user.email}</span>
              )}
            </div>
            <div className="flex items-center justify-between">
              {editEmail ? (
                <button className="border p-1 cursor-pointer text-xs rounded-sm hover:bg-accent" onClick={handleEmail}>
                  Save changes
                </button>
              ) : (
                <button onClick={toggleEdit} className="border p-1 cursor-pointer text-xs rounded-sm hover:bg-accent">
                  Edit email
                </button>
              )}
              <ThemeToggle />
            </div>
          </div>
          {isBillingEnabled && (
            <>
              <Divider />
              <MenuItem href="/billing">
                <IconCreditCard className="w-4 h-4" />
                <span>Billing & Profile</span>
                {billing === "OVERUSE" && <PingSignal color="warning" size="sm" />}
              </MenuItem>
            </>
          )}
          <Divider />
          <MenuItem href="#" onClick={signOut}>
            <IconDoorExit className="w-4 h-4" />
            <span>Sign out</span>
          </MenuItem>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
