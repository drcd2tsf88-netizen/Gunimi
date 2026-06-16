"use server";

import { createClient }
from "@/lib/supabase/server";

import { getCurrentWorkspace }
from "@/lib/workspace/getCurrentWorkspace";

import { Company } from "@/types/company";

export async function getCompanies() {
  try {
    const workspace =
      await getCurrentWorkspace();

    if (!workspace) {
      return [];
    }

    const supabase =
      await createClient();

    const {
      data: companies,
      error,
    } = await supabase
      .from(
        "workspace_companies"
      )
      .select(`
        *,
        owner:profiles!owner_id(
          id,
          full_name,
          avatar_url
        )
      `)
      .eq(
        "workspace_id",
        workspace.id
      )
      .order(
        "created_at",
        {
          ascending: false,
        }
      );

    if (
      error ||
      !companies
    ) {
      console.error(error);

      return [];
    }

    const companyIds =
      companies.map(
        (company) =>
          company.id
      );

    const {
      data: contacts,
    } = await supabase
      .from(
        "workspace_contacts"
      )
      .select(
        "id, company_id"
      )
      .in(
        "company_id",
        companyIds
      );

    const {
      data: deals,
    } = await supabase
      .from(
        "workspace_deals"
      )
      .select(
        `
        id,
        company_id,
        value,
        probability,
        stage
      `
      )
      .in(
        "company_id",
        companyIds
      );

    return companies.map(
      (company) => {
        const companyContacts =
          contacts?.filter(
            (
              contact
            ) =>
              contact.company_id ===
              company.id
          ) || [];

        const companyDeals =
          deals?.filter(
            (deal) =>
              deal.company_id ===
              company.id
          ) || [];

        const pipelineValue =
          companyDeals.reduce(
            (
              total,
              deal
            ) => {
              if (
                deal.stage ===
                  "won" ||
                deal.stage ===
                  "lost"
              ) {
                return total;
              }

              const value =
                Number(
                  deal.value ||
                    0
                );

              const probability =
                Number(
                  deal.probability ||
                    0
                );

              return (
                total +
                value *
                  (probability /
                    100)
              );
            },
            0
          );

        return {
          ...company,

          contacts_count:
            companyContacts.length,

          deals_count:
            companyDeals.filter(
              (deal) =>
                deal.stage !==
                  "won" &&
                deal.stage !==
                  "lost"
            ).length,

          pipeline_value:
            pipelineValue,
        } as unknown as Company;
      }
    );
  } catch (error) {
    console.error(error);

    return [];
  }
}