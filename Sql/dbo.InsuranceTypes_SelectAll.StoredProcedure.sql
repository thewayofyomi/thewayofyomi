USE [YellowBrick]
GO
/****** Object:  StoredProcedure [dbo].[InsuranceTypes_SelectAll]    Script Date: 7/6/2023 2:57:27 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- Author:			Sean Humphreys
-- Create date:		07/05/2023
-- Description:		Select all from dbo.InsuranceTypes
-- Code Reviewer:	Raymond Medina

-- MODIFIED BY: 
-- MODIFIED DATE:
-- Code Reviewer:
-- Note:

CREATE PROC [dbo].[InsuranceTypes_SelectAll]

AS
/* -----Test Code-----

	Execute dbo.InsuranceTypes_SelectAll

*/
BEGIN

	SELECT			Id,
					Name

	FROM			dbo.InsuranceTypes

END
GO
