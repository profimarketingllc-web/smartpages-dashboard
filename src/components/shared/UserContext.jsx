import { createContext, useContext, onMount } from "solid-js";
import { createStore } from "solid-js/store";

/* -------------------------------------------------- */
/* Context                                            */
/* -------------------------------------------------- */
const UserContext = createContext();

/* -------------------------------------------------- */
/* Default State                                      */
/* -------------------------------------------------- */
const DEFAULT_USER = {
  id: null,
  name: null,
  email: null,
  company: null,
  language: "de",
  loggedIn: false,

  trial: {
    active: false,
    expiresAt: null,
    daysLeft: null,
  },

  products: {
    smartprofile: false,
    smartpage: false,
    smartdomain: false,
    smartlinks: false,
  },
};

/* -------------------------------------------------- */
/* Provider                                           */
/* -------------------------------------------------- */
export function UserProvider(props) {
  const [user, setUser] = createStore(DEFAULT_USER);

  /* ---------------------------------------------- */
  /* Init (Astro → Client)                          */
  /* ---------------------------------------------- */
  function hydrateFromWindow() {
    if (typeof window === "undefined") return;

    const u = window.SMARTPAGES_USER;
    if (!u) return;

    setUser({
      id: u.id ?? null,
      name: u.name ?? null,
      email: u.email ?? null,
      company: u.company ?? null,
      language: u.language ?? "de",
      loggedIn: true,

      trial: {
        active: !!u.trial?.active,
        expiresAt: u.trial?.expiresAt ?? null,
        daysLeft: u.trial?.daysLeft ?? null,
      },

      products: {
        smartprofile: !!u.products?.smartprofile,
        smartpage: !!u.products?.smartpage,
        smartdomain: !!u.products?.smartdomain,
        smartlinks: !!u.products?.smartlinks,
      },
    });
  }

  /* ---------------------------------------------- */
  /* Lifecycle                                      */
  /* ---------------------------------------------- */
  onMount(() => {
    hydrateFromWindow();
  });

  /* ---------------------------------------------- */
  /* Actions                                        */
  /* ---------------------------------------------- */
  const actions = {
    refresh: hydrateFromWindow,

    logout() {
      setUser(DEFAULT_USER);
    },

    hasProduct(product) {
      return !!user.products?.[product];
    },

    isTrialEndingSoon() {
      return user.trial.active && user.trial.daysLeft !== null && user.trial.daysLeft <= 3;
    },
  };

  return (
    <UserContext.Provider value={{ user, actions }}>
      {props.children}
    </UserContext.Provider>
  );
}

/* -------------------------------------------------- */
/* Hook                                              */
/* -------------------------------------------------- */
export function useUser() {
  const ctx
